import axios from 'axios';
import {useEffect, useState} from 'react';
import { IProject } from '../models';
import { headers } from '../components-settings/headers';


const BaseURL = process.env.REACT_APP_BASE_URL


export function useProjects() {
    const [projects, setProjects] = useState<IProject[]>([])
    const token = window.localStorage.getItem('token')
    async function fetchProjects() {
        await axios.get<IProject[]>(
          `${BaseURL}/projects`,
          { headers : {
            ...headers, 
            'authorization': `Token ${token}`
        }}
        )
        .then((response) => {
          if(response.status === 200){
            setProjects(response.data)
          }
        })
        .catch((error) => {
        })
    }
      useEffect(() => {
        fetchProjects()
      }, [])

    return {projects}
}