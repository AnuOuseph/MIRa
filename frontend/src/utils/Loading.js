const Loading = () => {
    return (
        <div className="bg-white rounded-xl border-dashed border-gray-300 border p-8 text-center flex flex-col gap-4 justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600 text-xs">Analyzing your music... This may take a moment</p>
        </div>
    );
}
export default Loading;