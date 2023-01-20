import React, {useState} from 'react'
import { List, Typography, Card, CardContent } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { Box } from '@mui/system'
import NewFolder from './NewFolder'

export default function FolderList({folders}) {
    const {folderId} = useParams()

    const [activeFolderId, setActiveFolderId] = useState(folderId)

    return (
        <List sx={{
            width: '100%',
            height: '100%',
            bgcolor:'#7D9D9C',
            padding: '10px',
            textAlign:'left',
            overflowY: 'auto',
        }}
        subheader={
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography sx={{fontWeight: 'bold', color: 'white'}}>
                    Folders
                </Typography>
                <NewFolder/>
            </Box>
        }
        >
            {
                folders.map(({id, name}) => {
                    return (
                        <Link
                            key={id}
                            to={`/folders/${id}`}
                            style={{textDecoration: 'none'}}
                            onClick={() => setActiveFolderId(id)}
                        >
                            <Card sx={{
                                mb: '5px', 
                                backgroundColor: id === activeFolderId ? 'rgb(255 211 140)' : null
                                }}
                            >
                                <CardContent 
                                    sx={{ '&:last-child': {pb: '10px'} ,padding: '10px'}}
                                >
                                    <Typography sx={{fontSize: 14, fontWeight: 'bold'}}>{name}</Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })
            }
        </List>
    )
}
