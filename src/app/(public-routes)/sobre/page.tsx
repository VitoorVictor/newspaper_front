export default function SobrePage() {
  return (
    <div className="space-y-0">
      {/* Seção Principal - Sobre a Revista */}
      <div className="container mx-auto my-4 md:my-8 p-4 space-y-4 md:space-y-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Sobre a Revista Imagem Industrial
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conheça nossa história e missão
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Nossa História
            </h2>
            <p className="text-gray-600 leading-relaxed">
              A Revista Industrial nasceu da necessidade de conectar empresas,
              empreendedores e profissionais do setor industrial, criando uma
              plataforma que não apenas informa, mas também inspira e fortalece
              o ecossistema industrial da região.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Nossa missão é ser a principal fonte de informação e conexão para
              o setor industrial, promovendo o desenvolvimento sustentável, a
              inovação tecnológica e o crescimento econômico da região.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              O que oferecemos
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Notícias atualizadas do setor industrial
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Guia completo de empresas e fornecedores
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Cobertura de eventos e feiras do setor
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Coluna social com eventos da comunidade
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Seção de Estatísticas - com cor de fundo que cobre toda a largura */}
      <div className="bg-gray-100 py-8 md:py-12">
        <div className="container mx-auto px-4 space-y-4 md:space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Números que nos orgulham
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Resultados que demonstram nosso compromisso com a qualidade
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                500+
              </div>
              <div className="text-gray-600">Empresas cadastradas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                1000+
              </div>
              <div className="text-gray-600">Notícias publicadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">50+</div>
              <div className="text-gray-600">Eventos cobertos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                10k+
              </div>
              <div className="text-gray-600">Leitores mensais</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção dos Desenvolvedores */}
      <div className="container mx-auto my-4 md:my-8 p-4 space-y-4 md:space-y-6">
        <div className="max-w-2xl mx-auto text-center border-t pt-8">
          <p className="text-sm text-gray-500 mb-4">Desenvolvido com ❤️ por</p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <a
              href="https://github.com/dev1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              @dev1
            </a>
            <span className="text-gray-300">•</span>
            <a
              href="https://github.com/dev2"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              @dev2
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
