import { Wrench } from "lucide-react";
import { Badge } from "../ui/badge";

export const BuildingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 mx-auto bg-[#182641] rounded-full flex items-center justify-center shadow-lg">
          <Wrench className="h-10 w-10 text-white animate-pulse" />
        </div>

        <Badge className="bg-[#182641] text-white px-4 py-2">🚀 Em breve</Badge>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Em Construção
          </h1>
          <p className="text-lg text-gray-600">
            Esta página estará disponível em breve!
          </p>
        </div>

        {/* {showBackButton && (
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2 hover:bg-[#182641] hover:text-white bg-transparent border-[#182641] text-[#182641]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>

            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-[#182641] hover:bg-[#1e2d4a] text-white"
            >
              Ir para Home
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
};
