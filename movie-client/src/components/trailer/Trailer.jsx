import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";

const Trailer = () => {
  const { ytTrailerId } = useParams();

  return (
    <div className="react-player-container">
      {ytTrailerId && (
      <ReactPlayer
        src={`https://www.youtube.com/watch?v=${ytTrailerId}`}
        controls
        width="100%"
        height="819px"   // try giving an explicit height
      />


      )}

    </div>
  );
};
export default Trailer;