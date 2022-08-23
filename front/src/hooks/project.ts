import axios from 'axios';
import {useEffect, useState} from 'react';
import { IProject } from '../models';

const BaseURL = process.env.REACT_APP_BASE_URL

export function useProjects() {
    const [projects, setProjects] = useState<IProject[]>([])

    async function fetchProjects() {
        const responce = await axios.get<IProject[]>(BaseURL+'/projects')
        setProjects(responce.data)
    }
      useEffect(() => {
        fetchProjects()
      }, [])

    return {projects}
}