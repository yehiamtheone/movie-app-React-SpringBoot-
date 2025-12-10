import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { hideAlert } from '../store/AlertSlice';
import { useEffect } from 'react';
const GlobalAlert = () => {
const alert = useSelector(state => state.alert);
const dispatch = useDispatch();
useEffect(()=>{
    let timer;
    if (alert.show) {
        timer = setTimeout(() => dispatch(hideAlert()), 3000);
    }
    // console.log(alert);
    return () => {
        if (timer) clearTimeout(timer);
    };
},[alert.show, dispatch])

// Render nothing when alert is not shown to avoid leftover layout space
if (!alert.show) return null;

return (
    <div className='globalalert'>

        <Alert className='m-0'
         style={{
            position: "fixed",
            bottom: "70px",
            right: "700px",
            zIndex: 9999,
            width: "500px"
        }}
            variant={alert.variant}
            show={alert.show}
>
            {alert.message}
        </Alert>
    </div>
);
};

export default GlobalAlert;