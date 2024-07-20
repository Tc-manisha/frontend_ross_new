import { CircularProgress } from "@mui/material";

export default function CircularLoadingComp() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <CircularProgress />
        </div>
    )
}