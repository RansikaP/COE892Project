from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Body, Response, status
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, timedelta, datetime
from geopy.distance import great_circle as GRC
from geopy.geocoders import Nominatim

app = FastAPI()
origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

geolocator = Nominatim(user_agent="main")
pack = {}
trans = {}
pack_id_head = 0
trans_id_head = 0

class Package(BaseModel):
    package_id: Optional[int]
    weight: float
    volume: float
    starting_country: str
    starting_city: str
    destination_country: str
    destination_city: str
    transport_id: Optional[int]
    delivery_date: Optional[str]
    current_transport_status: Optional[str] = "Not Shipped"

class Transportation(BaseModel):
    transport_id: Optional[int]
    method: str
    starting_country: str
    destination_country: str
    max_volume: float
    max_weight: float
    current_weight: float
    current_volume: float
    transport_date: str

pack ={
   0:Package(package_id=69, weight=40, volume=10, starting_country="Russia", starting_city="Moscow", destination_country="Iran",destination_city="IDK", transport_id=12345, delivery_date= "4 15 2023", current_transport_status="At Starting Facility")
}

trans = {
   0: Transportation(transport_id=12345, method="Plane", starting_country="Russia", destination_country="Iran", max_volume=10000, max_weight=7100, current_weight=40, current_volume=10, transport_date="4 10 2023")
}

@app.get("/")
def read_root():
   return {"Hello from Server"}

@app.get("/package/{package_id}")
async def get_package(package_id: int, response : Response):
   index = -1
   for i in range(len(pack)):
       if pack[i].package_id == package_id:
           index = i
           break
   if index == -1:
      response.status_code=status.HTTP_204_NO_CONTENT
      return {f"Package with {package_id=} does not exist."}
   return {"PackageInfo": pack[index]}

@app.put("/package/{package_id}")
async def update_package(*, package_id : int, status: str = Body(..., embed=True) ):
   for i in range(len(pack)):
       if pack[i].package_id == package_id:
           pack[i].current_transport_status = status
           index = i
           break
   return {"Message":"Successfully Updated"}

@app.delete("/package/{package_id}")
async def delete_package(package_id: int):
   if package_id not in pack:
      HTTPException(status_code=404, detail=f"Package with {package_id} does not exist.")
   for p in pack:
      if pack[p].package_id == package_id:
         id = p
         break
   packag = pack.pop(id)
   return {"Successfully Deleted"}

@app.post("/package")
async def add_package(p: Package):
    global pack_id_head
    pack[pack_id_head] = p
    pack[pack_id_head].package_id = pack_id_head
    pack_id_head += 1
    determine_transportation_method(p)
    determine_delivery_date(p)
    return {"id": pack_id_head - 1, "message": "Package added successfully!"}

@app.post("/transportation")
async def add_transportation_method(t: Transportation):
    global trans_id_head
    trans[trans_id_head] = t
    trans[trans_id_head].transport_id = trans_id_head
    trans_id_head += 1
    return {"id": trans_id_head - 1, "message": "Transportation option added successfully!"}

@app.get("/transportation")
async def get_all_trans_vehicles():
    return trans

def determine_transportation_method(p):
   global trans_id_head
   today = date.today()
   d = today.strftime("%Y/%m/%d")
   next_day = (today + timedelta(days=1)).strftime("%Y/%m/%d")
   found_transport = False
   if p.starting_country == p.destination_country:
      method = "truck"
   else:
      method = "plane"

   for keys in trans:
      if (trans[keys].method == method) and (trans[keys].starting_country == p.starting_country) and \
         (trans[keys].destination_country == p.destination_country) and trans[keys].current_volume + p.volume <= trans[keys].max_volume and \
         (trans[keys].current_weight + p.weight <= trans[keys].max_weight):
            found_transport = True
            pack[p.package_id].transport_id = keys
            trans[keys].current_weight += p.weight
            trans[keys].current_volume += p.volume
            break

   if not found_transport:
      t = Transportation(transport_id=trans_id_head, method=method, starting_country=p.starting_country,
                           destination_country=p.destination_country, max_volume=1000000, max_weight=10000,
                           current_weight=0, current_volume=0, transport_date=next_day)
      trans_id_head += 1
      trans[t.transport_id] = t
      pack[p.package_id].transport_id = t.transport_id
      trans[t.transport_id].current_weight += p.weight
      trans[t.transport_id].current_volume += p.volume

def determine_delivery_date(p):
    plane_speed = 900  # kmph
    truck_speed = 100  # kmph
    city_start = p.starting_city
    city_end = p.destination_city

    country_start = p.starting_country
    country_end = p.destination_country

    method = trans[p.transport_id].method

    if method == 'plane':
        geo_loc_start = geolocator.geocode(country_start)
        geo_loc_end = geolocator.geocode(country_end)

        start_plane = (geo_loc_start.latitude, geo_loc_start.longitude)
        end_plane = (geo_loc_end.latitude, geo_loc_end.longitude)

        plane_distance = GRC(start_plane, end_plane).km
        plane_time = (plane_distance/plane_speed) * 3600

        take_off_date = trans[p.transport_id].transport_date + ', 23:59:00'
        take_off_date = datetime.strptime(take_off_date, "%Y/%m/%d, %H:%M:%S")

        plane_arrival_date = take_off_date + timedelta(seconds=plane_time)

        truck_leaving_date = datetime(year=plane_arrival_date.year, month=plane_arrival_date.month, day=plane_arrival_date.day, hour=23, minute=59, second=0)

        geo_loc_city = geolocator.geocode(city_end + ',' + country_end)
        city_loc = (geo_loc_city.latitude, geo_loc_city.longitude)
        truck_distance = GRC(end_plane, city_loc).km
        truck_time = (truck_distance/truck_speed) * 3600

        delivery_date = (truck_leaving_date + timedelta(seconds=truck_time)).date().strftime("%Y/%m/%d")
        pack[p.package_id].delivery_date = delivery_date
    else:
        geo_loc_start = geolocator.geocode(city_start)
        geo_loc_end = geolocator.geocode(city_end)

        truck_start = (geo_loc_start.latitude, geo_loc_start.longitude)
        truck_end = (geo_loc_end.latitude, geo_loc_end.longitude)

        truck_distance = GRC(truck_start, truck_end).km

        travel_time = round(3600 * truck_distance/truck_speed)

        truck_leaving_date = trans[p.transport_id].transport_date + ', 23:59:00'
        truck_leaving_date = datetime.strptime(truck_leaving_date, "%Y/%m/%d, %H:%M:%S")

        truck_arrival_date = truck_leaving_date + timedelta(seconds=travel_time)

        pack[p.package_id].delivery_date = truck_arrival_date.date().strftime("%Y/%m/%d")