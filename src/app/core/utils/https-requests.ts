//import { API_BASE_URL } from "./constants";
import axios from "axios";

export const GET_METHOD = async (url: string, hasToken: boolean): Promise<any> => {
    const token = localStorage.getItem("spotify_access_token");

    try {
        const response = await axios.get(
            `${url}`, (hasToken == true ? {
                headers: {
                    accept: "*/*",
                    Authorization: (hasToken === true ? ("Bearer " + token) : "Bearer"),
                },
            } : undefined)

        );
        return response.data;
    } catch (error: any) {
        if (error.status == 401) {
            window.location.href = "/auth/login";
        }
        return { error: true, status: error.status };
    }
};

export const POST_METHOD = async (url: string, data: any, hasToken: boolean): Promise<any> => {
    const token = localStorage.getItem("spotify_access_token");

    try {
        const response = await axios.post(
            `${url}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    accept: "*/*",
                    Authorization: (hasToken === true ? ("Bearer " + token) : "Bearer"),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.status == 401) {
            window.location.href = "/auth/login";
        }
        return { error: true, status: error.status };
    }
};


export const PUT_METHOD = async (url: string, data: any, hasToken: boolean): Promise<any> => {
    const token = localStorage.getItem("spotify_access_token");

    try {
        const response = await axios.put(
            `${url}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    accept: "*/*",
                    Authorization: (hasToken === true ? ("Bearer " + token) : "Bearer"),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.status == 401) {
            window.location.href = "/auth/login";
        }
        return { error: true, status: error.status };
    }
};


export const DELETE_METHOD = async (url: string, hasToken: boolean): Promise<any> => {
    const token = localStorage.getItem("spotify_access_token");

    try {
        const response = await axios.delete(
            `${url}`, (hasToken == true ? {
                headers: {
                    accept: "*/*",
                    Authorization: (hasToken === true ? ("Bearer " + token) : "Bearer"),
                },
            } : undefined)

        );
        return response.data;
    } catch (error: any) {
        if (error.status == 401) {
            window.location.href = "/auth/login";
        }
        return { error: true, status: error.status };
    }
};