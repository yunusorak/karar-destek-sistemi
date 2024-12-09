export const calculateOptimisticCriterion = (matrix) => {
    return matrix.map(alt => Math.max(...alt.values));
  };
  
  export const calculatePessimisticCriterion = (matrix) => {
    return matrix.map(alt => Math.min(...alt.values));
  };
  
  export const calculateHurwiczCriterion = (matrix, alpha) => {
    return matrix.map(alt => {
      const max = Math.max(...alt.values);
      const min = Math.min(...alt.values);
      return alpha * max + (1 - alpha) * min;
    });
  };
  
  export const calculateEqualLikelihoodCriterion = (matrix) => {
    return matrix.map(alt => alt.values.reduce((sum, val) => sum + val, 0) / alt.values.length);
  };
  
  export const calculateSavageCriterion = (matrix) => {
    const maxValues = matrix[0].values.map((_, colIndex) => 
      Math.max(...matrix.map(alt => alt.values[colIndex]))
    );
  
     const regretMatrix = matrix.map(alt => 
      alt.values.map((val, colIndex) => maxValues[colIndex] - val)
    );
  
    return regretMatrix.map(row => Math.max(...row));
  };
  
  export const criteriaNames = {
    optimistic: "İyimserlik Ölçütü",
    pessimistic: "Kötümserlik Ölçütü",
    hurwicz: "Hurwicz Ölçütü",
    equalLikelihood: "Eş Olasılık Ölçütü",
    savage: "Pişmanlık (Savage) Ölçütü"
  };
  