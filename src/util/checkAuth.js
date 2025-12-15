import Cookies from 'js-cookie';

export async function checkAuth() {
  const token = Cookies.get('accessToken');

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!res.ok) return null;

    const user = await res.json();
    
    return user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return null;
  }
}