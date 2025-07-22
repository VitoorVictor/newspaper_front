export function CustomPagination() {
  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
          Anterior
        </button>
        <button className="px-4 py-2 text-sm bg-[#182641] text-white rounded-lg">
          1
        </button>
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          2
        </button>
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          3
        </button>
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          Próximo
        </button>
      </div>
    </div>
  );
}
