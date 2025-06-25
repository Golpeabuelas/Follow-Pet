const url = 'https://localhost:3000';

export async function checkEmailAlreadyUsed(email) {
    try {
        const response = await fetch(`${url}/check-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error checking email:', error);
        return false; 
    }
}