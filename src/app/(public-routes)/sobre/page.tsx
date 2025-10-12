export default function SobrePage() {
  return (
    <div className="space-y-0">
      {/* Seção Principal - Sobre a Revista */}
      <div className="bg-gray-100 p-2">
        <div className="container mx-auto space-y-2 md:space-y-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Sobre a Revista Imagem Industrial
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A Imagem da Indústria Brasileira de Tintas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Nossa Essência
              </h2>
              <p className="text-gray-600 leading-relaxed">
                A <strong>Revista Imagem Industrial</strong> é uma publicação
                especializada que acompanha de perto o desenvolvimento da{" "}
                <strong>Indústria Brasileira de Tintas</strong>, valorizando
                cada elo da cadeia produtiva — dos insumos químicos às
                embalagens, dos equipamentos às soluções de automação, das
                cargas minerais ao transporte, do laboratório à linha de
                produção.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Voltada a Empresários, Gestores, Técnicos, Fornecedores e
                Representantes Comerciais, nossa missão é oferecer informação
                estratégica, tendências de mercado, inovação tecnológica e
                conteúdo que apoie o crescimento sustentável e competitivo do
                setor no Brasil.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                O que você encontra em cada edição
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Entrevistas e artigos técnicos
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Análises econômicas e tendências de mercado
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Avanços em pesquisa e desenvolvimento
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Casos de empresas que fazem a diferença
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Destaque */}
      <div className="bg-gray-100 p-2">
        <div className="container mx-auto space-y-2 md:space-y-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Mais do que uma Revista
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Somos uma <strong>Plataforma de Conexão e Valorização</strong> do
              nosso segmento, reunindo quem investe, produz, representa,
              transforma e acredita na força da Indústria Brasileira de Tintas.
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Cards */}
      <div className="bg-gray-100 p-2">
        <div className="container mx-auto space-y-2 md:space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl font-bold">📰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Publicação Especializada
              </h3>
              <p className="text-gray-600 text-sm flex-grow">
                Foco exclusivo na Indústria Brasileira de Tintas e toda sua
                cadeia produtiva
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl font-bold">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Público-Alvo Definido
              </h3>
              <p className="text-gray-600 text-sm flex-grow">
                Empresários, Gestores, Técnicos, Fornecedores e Representantes
                Comerciais
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl font-bold">🔗</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Plataforma de Conexão
              </h3>
              <p className="text-gray-600 text-sm flex-grow">
                Reunindo todos os elos da cadeia produtiva em um só lugar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
