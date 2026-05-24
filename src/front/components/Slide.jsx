export const Slide = () => (

<div
  className="w-100 d-flex align-items-center justify-content-center position-relative"
  style={{
    backgroundImage: "url('https://t4.ftcdn.net/jpg/07/83/07/55/360_F_783075558_hlwmx9Op2RJjqNJa4ERFfSyxREoVGsYA.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "calc(100vh - 200px)"
  }}
>
  <div
    className="w-100 d-flex align-items-center justify-content-center"
  >
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <h1 className="text-white text-center fw-bold px-3">
        Ponerte en forma nunca fue tan sencillo
      </h1>
      <p className="text-center h3 text-white px-3 my-3">
        Nuestros planes completamente personalizados harán a explotar todo tu potencial
      </p>
      <button className="btn btn-danger rounded-pill px-5 m-3">
        Saber más
      </button>
    </div>
  </div>
</div>

);


