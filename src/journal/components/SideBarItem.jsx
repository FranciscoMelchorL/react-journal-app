import { TurnedInNot } from '@mui/icons-material';
import { Grid, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveNote } from '../../store/journal';

export const SideBarItem = ({title = '', body, id, date, imageURL = []}) => {

    const dispatch = useDispatch();

    const onActiveNote = () => {
        dispatch(setActiveNote({title, body, id, date, imageURL}));
    }


    const newTitle = useMemo(() => {
        return title.length > 17 ? title.substring(0,17) + '...' : title;
    }, [title])

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onActiveNote}>

                <ListItemIcon>
                    <TurnedInNot/>
                </ListItemIcon>

                <Grid container>
                    <ListItemText primary={newTitle}/>
                    <ListItemText secondary={body}/>
                </Grid>

            </ListItemButton>
        </ListItem>
    )
}
