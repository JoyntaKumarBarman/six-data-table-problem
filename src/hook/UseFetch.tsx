import React, {useState, useEffect} from 'react';

interface Response {
    low_stock_threshold: number;
    products: [];
    total_products: number;
}

const useFetch = (url: string): {data: any; isLoading: boolean; hasError: boolean } => {

    const [data, setData] = useState<{  }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}`);
                const data = await response.json();
                setData(data);
            } catch (error) {
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData().then();
    }, [url]);

    return {data, isLoading, hasError};
};

export default useFetch;