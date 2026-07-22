function SummaryCard({ title, amount, icon, color }) {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-md
      p-6
      hover:shadow-xl
      transition-all
      duration-300
      flex
      justify-between
      items-center
      "
    >
      <div>

        <p className="text-gray-500 text-sm">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2">
          ₹{Number(amount).toLocaleString("en-IN")}
        </h2>

        <p className="text-green-500 text-sm mt-2">
          ↑ Updated
        </p>

      </div>

      <div
        className={`
          ${color}
          w-16
          h-16
          rounded-full
          flex
          items-center
          justify-center
          text-white
          text-2xl
          shadow-lg
        `}
      >
        {icon}
      </div>
    </div>
  );
}

export default SummaryCard;