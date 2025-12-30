export default function ShoutItem({ shout }) {
    return (
        <div className="mb-3 p-2 bg-white text-gray-900 rounded shadow border">
            <strong className="text-gray-800">{shout.user}</strong>: {shout.message}
            <div className="text-gray-500 text-xs">
                ({shout.lat.toFixed(4)}, {shout.lon.toFixed(4)})
            </div>
        </div>

    );
}
