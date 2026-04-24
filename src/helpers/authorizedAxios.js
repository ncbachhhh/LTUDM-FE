import axios from "axios";

const authorizedAxios = () => {
    const accessToken = localStorage.getItem("accessToken");
    return axios.create({
        headers: { Authorization: `Bearer ${accessToken}` },
    });
};

export default authorizedAxios;