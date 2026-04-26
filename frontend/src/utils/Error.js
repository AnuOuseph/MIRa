const Error = ({ message }) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center w-full mt-4 flex justify-center items-center">
            <p className="text-red-600 font-medium text-xs">Error: {message}</p>
        </div>
    );
}
export default Error;