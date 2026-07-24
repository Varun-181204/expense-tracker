function SummaryCard({ title, amount, icon, color }) {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      bg-white
      p-6
      shadow-lg
      border
      border-gray-100
      hover:-translate-y-2
      hover:shadow-2xl
      transition-all
      duration-300
      "
    >
      {/* Decorative Background Circle */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gray-100 rounded-full opacity-40"></div>

      <div className="relative flex justify-between items-start">

        <div>

          <p className="text-gray-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-800">
            ₹{Number(amount).toLocaleString("en-IN")}
          </h2>

          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            📈 Updated
          </div>

        </div>

        <div
          className={`
            ${color}
            w-16
            h-16
            rounded-2xl
            flex
            items-center
            justify-center
            text-white
            text-2xl
            shadow-xl
            hover:scale-110
            transition-transform
            duration-300
          `}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default SummaryCard;