import React, {useState} from 'react'
import { List, Typography, Card, CardContent, DialogContent, TextField } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { Box } from '@mui/system'
import NewFolder from './NewFolder'
import SwipeToDelete from 'react-swipe-to-delete-ios'
import DeleteFolder from './DeleteFolder'
import ReactSearchBox from "react-search-box";

export default function FolderList({folders}) {
    const typoStyle = {
        fontSize: 14, 
        fontWeight: 'bold', 
        display: 'flex', 
        alignItems:'centrer', 
        justifyContent: 'space-between'
    }
    const linkStyle = {
        width: '100%',
        height: '100%',
        bgcolor:'#7D9D9C',
        padding: '10px',
        textAlign:'left',
        overflowY: 'auto',
    }
    const boxStyle = {
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    }

    const {folderId} = useParams()

    const [activeFolderId, setActiveFolderId] = useState(folderId)

    return (
        <List sx={linkStyle}
        subheader={
            <Box sx={boxStyle}>
                <Typography sx={{fontWeight: 'bold', color: 'white'}}>
                    Folders
                </Typography>
                <NewFolder/>
            </Box>
        }
        >   

            <ReactSearchBox
                placeholder="Search Folder"
                value="Doe"
                callback={(record) => console.log(record)}
            />
                    

            {
                folders.map(({id, name}) => {
                    return (
                        <Link
                            key={id}
                            to={`/folders/${id}`}
                            style={{textDecoration: 'none'}}
                            onClick={() => setActiveFolderId(id)}
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
                                    backgroundColor: id === activeFolderId ? 'rgb(255 211 140)' : null,
                                    height: '50px',
                                    }}
                                >
                                    <CardContent 
                                        // sx={{ '&:last-child': {pb: '10px'} ,padding: '10px'}}
                                    >
                                        <Typography sx={typoStyle}>
                                            {name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </SwipeToDelete>
                        </Link>
                    )
                })
            }
        </List>
    )
}
