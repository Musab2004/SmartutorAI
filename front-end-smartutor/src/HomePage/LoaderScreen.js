import CircularProgress from '@mui/material/CircularProgress';
const LoaderScreen = () => {
  return (
    <>
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
     {/* <h1>Loading...</h1> */}
       <CircularProgress />
     </div>
    </>
  );
};
export default LoaderScreen;
