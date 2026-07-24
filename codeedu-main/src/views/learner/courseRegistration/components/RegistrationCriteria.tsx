
const RegistrationCriteria = () => {
  
  return (
    <div className="w-full p-4 bg-white rounded-xl">
      <div className="mb-2">
        <div className="flex justify-between items-center gap-1 border-b border-gray-300 pb-1">
          <h2 className="text-lg font-semibold text-primary">
            Registration Criteria 
          </h2>
          <a href="#" className="text-sm text-gray-600 underline hover:no-underline">Guideline</a>
        </div>
        <ol className="text-sm text-gray-600 mt-3">
          <li>1. Maximum courses: 3 courses</li>
          <li>2. Maximum credits: 9 credits</li>
          <li>3. Current: 10 credits (3 courses)</li>
        </ol>
      </div>
    </div>
  );
};

export default RegistrationCriteria;
