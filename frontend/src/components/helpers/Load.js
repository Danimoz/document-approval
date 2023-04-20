import { RevolvingDot } from "react-loader-spinner";

const Load = () => {
  return (
    <div className="flex justify-center items-center">
      <RevolvingDot
        height="100"
        width="100"
        radius="15"
        color="#2D7BD8"
        secondaryColor=''
        ariaLabel="revolving-dot-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  )
}

export default Load;