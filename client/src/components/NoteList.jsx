import { Grid, List, Card, CardContent, Typography, Tooltip, IconButton, DialogContent, TextField } from '@mui/material'
import React, {useEffect, useState} from 'react'
import { Link, Outlet, useParams, useLoaderData, useSubmit, useNavigate} from 'react-router-dom'
import { Box } from '@mui/system'
import { NoteAddOutlined } from '@mui/icons-material'
import moment from 'moment'
import ReactSearchBox from "react-search-box";
import SwipeToDelete from 'react-swipe-to-delete-ios'

import DeleteFolder from './DeleteFolder'

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
                    <ReactSearchBox
                        placeholder="Search Note"
                        value="Doe"
                        callback={(record) => console.log(record)}
                    />
                    {folder.notes.map(({id, content, updatedAt}) => {
                            return (
                                <Link
                                    key={id}
                                    to={`note/${id}`}
                                    style={{textDecoration: 'none'}}
                                    onClick={() => setActiveNoteId(id)}
                                >
                                    <SwipeToDelete
                                        // optional
                                        height={50} // default
                                        transitionDuration={250} // default
                                        deleteWidth={75} // default
                                        deleteThreshold={75} // default
                                        showDeleteAction={true} //default
                                        deleteColor="rgba(252, 58, 48, 1.00)" // default
                                        deleteComponent={<DeleteFolder/>}
                                        disabled={false} // default
                                        id="swiper-1" // not default
                                        className="my-swiper" // not default
                                        rtl={false} // default
                                        onDeleteConfirm={(onSuccess, onCancel) => {
                                            // not default - default is null
                                            if (window.confirm("Do you really want to delete this item ?")) {
                                                onSuccess();
                                            console.log('Delete');
                                            } else {
                                                onCancel();
                                            }
                                        }}                                
                                    >
                                        <Card sx={{
                                            mb: '5px',
                                            backgroundColor: id === activeNoteId ? 'rgb(255 211 140)' : null,
                                            height: 50
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
                                    </SwipeToDelete>
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
