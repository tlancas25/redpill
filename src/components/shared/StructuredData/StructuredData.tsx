import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default StructuredData;
