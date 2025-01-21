const BudgetProgress = ({ budget }) => {
    const percentage = (budget.spent / budget.amount) * 100;
    const remaining = budget.amount - budget.spent;
    
    return (
      <div className="w-full">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">
            ${budget.spent?.toLocaleString()} of ${budget.amount?.toLocaleString()}
          </span>
          <span className={`text-sm font-medium ${
            percentage >= 100 ? 'text-red-600' : 
            percentage >= budget.alertThreshold ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              percentage >= 100 ? 'bg-red-600' :
              percentage >= budget.alertThreshold ? 'bg-yellow-500' :
              'bg-green-600'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Remaining: ${remaining.toLocaleString()}
        </div>
      </div>
    );
  };

  export default BudgetProgress;