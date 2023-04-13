import axios from 'axios';

const url = "https:/coe892finalprojectserver.azurewebsites.net/"

async function post_package(volume, weight, startingCountry, startingCity, destinationCountry, destinationCity) {
    return await axios ({
        method: "post",
        url: url + "package",
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            weight: weight,
            volume: volume,
            starting_country: startingCountry,
            starting_city: startingCity,
            destination_country: destinationCountry,
            destination_city: destinationCity,
        },
    }).then(response => {
        return response.data.id
    }).catch(function (error) {
        console.log(error);
        return -2;
    })
}

async function get_package(id) {
    return await axios ({
        method: "get",
        url: url + "package/" + id,
        headers: {
            "Content-Type": "application/json",
        },
        data: {},
    }).then((response) => {
        console.log("get_package")
        return(response.data)
    }).catch(function (error) {
        console.log(error);
        return error;
    })
}

async function put_package(id, status) {
    return await axios ({
        method: "put",
        url: url + "package/" + id,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            status: status,
        },
    }).then((response) => {
        return(response.data.Message)
    }).catch(function (error) {
        console.log(error);
        return error;
    })
}    

export {post_package, get_package, put_package}