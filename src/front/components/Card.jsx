export const Card = () => {
  return (
    <>
      {/* Primera sección */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Texto */}
          <div className="text-white">
            <h3 className="text-4xl font-bold">Rutinas personalizadas</h3>

            <div className="my-5 h-1 w-20 rounded-full bg-red-600"></div>

            <p className="mb-4 text-2xl font-semibold">
              Transforma tu cuerpo de verdad.
            </p>

            <p className="leading-8 text-gray-300">
              Olvídate de las rutinas genéricas que no te dan ningún resultado.
              Nuestra APP analiza tu nivel actual, tu equipamiento, tus objetivos y
              tu historial para diseñar un plan específico de 12 semanas
              completamente personalizado para ti. Sin importar tu nivel, nuestra IA
              entrenada se adapta a ti para que en menos de dos meses consigas
              resultados reales.
            </p>

            <a
              href="#plans"
              className="mt-8 inline-flex rounded-full bg-red-600 px-8 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Empezar plan
            </a>
          </div>

          {/* Imagen */}
          <div>
            <img
              src="https://res.cloudinary.com/dr5mzsq8w/image/upload/v1779817716/13_Bog_entrenamiento_funcional_c4lora.jpg"
              alt="Entrenamiento funcional"
              className="h-full w-full rounded-2xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Segunda sección */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Imagen */}
          <div>
            <img
              src="https://res.cloudinary.com/dr5mzsq8w/image/upload/v1779817763/1366_2000_bo9qaz.jpg"
              alt="Dieta personalizada"
              className="h-full w-full rounded-2xl object-cover shadow-xl"
            />
          </div>

          {/* Texto */}
          <div className="text-white">
            <h3 className="text-4xl font-bold">Dietas específicas</h3>

            <div className="my-5 h-1 w-20 rounded-full bg-red-600"></div>

            <p className="mb-4 text-2xl font-semibold">
              Tu dieta 100% personalizada y adaptada a tus objetivos.
            </p>

            <p className="leading-8 text-gray-300">
              Mediante un sencillo cuestionario recogemos toda la información
              necesaria y nuestra IA entrenada prepara un plan real de 12 semanas
              con menú semanal, recetas deliciosas y fáciles de preparar,
              perfectamente adaptadas a tu rutina y a tu presupuesto.
            </p>

            <a
              href="#plans"
              className="mt-8 inline-flex rounded-full bg-red-600 px-8 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Empezar plan
            </a>
          </div>
        </div>
      </section>
    </>
  );
};