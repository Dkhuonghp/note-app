import { Grid, List, Card, CardContent, Typography, Tooltip, IconButton } from '@mui/material'
import React, {useEffect, useState} from 'react'
import { Link, Outlet, useParams, useLoaderData, useSubmit, useNavigate} from 'react-router-dom'
import { Box } from '@mui/system'
import { NoteAddOutlined } from '@mui/icons-material'
import moment from 'moment'

export default function NoteList() {
    const { noteId, folderId } = useParams()
    const [activeNoteId, setActiveNoteId] = useState(noteId)
    const {folder} = useLoaderData()
    const submit = useSubmit()
    const navigate = useNavigate()

    useEffect(() => {
        if(noteId) {
            setActiveNoteId(noteId)
            return
        }
        if(folder?.notes?.[0]) {
            navigate(`note/${folder.notes[0].id}`)
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteId, folder.notes])

    // const folder = { notes: [{id: '1', content: '<p>this is new note</p>' }] }
    const handleAddNewNote = () => {
        submit({
            content: '', 
            folderId
        }, 
        { 
            method: 'POST', 
            action: `/folders/${folderId}`
        })
    }
    return (
        <Grid container height='100%'>
            <Grid 
                item 
                xs={4} 
                sx={{ 
                    width: '100%', 
                    height: '100%',
                    maxWidth: 360, 
                    bgcolor: '#F0EBE3',
                    overflowY: 'auto',
                    padding: '10px',
                    textAlign: 'left',
                }}
            >
                <List
                    subheader={
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography sx={{fontWeight: 'bold'}}>Notes</Typography>
                            <Tooltip title='Add Note' onClick={handleAddNewNote}>
                                <IconButton size='small'><NoteAddOutlined/></IconButton>
                            </Tooltip>
                        </Box>
                    }
                >
                    {folder.notes.map(({id, content, updatedAt}) => {
                            return ( 
                                <Link
                                    key={id}
                                    to={`note/${id}`}
                                    style={{textDecoration: 'none'}}
                                    onClick={() => setActiveNoteId(id)}
                                >
                                    <Card sx={{
                                        mb: '5px',
                                        backgroundColor: id === activeNoteId ? 'rgb(255 211 140)' : null
                                    }}>
                                        <CardContent sx={{'&:last-child': {pb: '10px'}, padding: '10px'}}>
                                            <div style={{frontSize: 14, fontWeight: 'bold'}}
                                            dangerouslySetInnerHTML={{__html: `${content.substring(0, 30) || 'Empty'}`}}
                                            />
                                            <Typography sx={{fontSize: '10px', color: 'gray'}}>
                                                {moment(updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })
                    }
                </List>
            </Grid>
            <Grid item xs={8}>
                <Outlet/>
            </Grid>
        </Grid>
    )
}
