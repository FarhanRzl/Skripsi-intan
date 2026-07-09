export default function StepIndicator({ currentStep, totalSteps, labels }) {
  return (
    <div className="flex gap-4 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        return (
          <div
            key={step}
            className={`flex items-center gap-2 ${
              isActive || isCompleted ? "opacity-100" : "opacity-50"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isActive
                  ? "bg-brand-500 text-white"
                  : isCompleted
                  ? "bg-brand-100 text-brand-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </span>
            {labels?.[step - 1] && (
              <span className="text-sm font-medium text-gray-800">
                {labels[step - 1]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
