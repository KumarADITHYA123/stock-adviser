import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment, 
  collection, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

interface StockEntry {
  ticker: string;
  percentage: number;
}

interface UserData {
  usageCount: number;
  lastUpdated: any;
}

interface PortfolioRecord {
  portfolio: StockEntry[];
  timestamp: any;
  userAgent: string;
}

// Get or create user document
const getUserDoc = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // Create new user document
    await setDoc(userRef, {
      usageCount: 0,
      lastUpdated: serverTimestamp(),
      createdAt: serverTimestamp()
    });
  }
  
  return userRef;
};

// Increment usage counter
export const incrementUsageCounter = async (userId: string): Promise<number> => {
  try {
    const userRef = await getUserDoc(userId);
    
    // Increment the counter
    await updateDoc(userRef, {
      usageCount: increment(1),
      lastUpdated: serverTimestamp()
    });
    
    // Get updated count
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() as UserData;
    return userData.usageCount;
  } catch (error) {
    console.error('Error incrementing usage counter:', error);
    // Fallback to localStorage
    const localCount = parseInt(localStorage.getItem('portfolio-usage-count') || '0', 10) + 1;
    localStorage.setItem('portfolio-usage-count', localCount.toString());
    return localCount;
  }
};

// Get current usage count
export const getUsageCount = async (userId: string): Promise<number> => {
  try {
    const userRef = await getUserDoc(userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserData;
      return userData.usageCount;
    }
    return 0;
  } catch (error) {
    console.error('Error getting usage count:', error);
    // Fallback to localStorage
    return parseInt(localStorage.getItem('portfolio-usage-count') || '0', 10);
  }
};

// Save portfolio to history
export const savePortfolio = async (userId: string, portfolio: StockEntry[]): Promise<void> => {
  try {
    const portfolioData: PortfolioRecord = {
      portfolio,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent
    };
    
    await addDoc(collection(db, 'portfolios'), {
      ...portfolioData,
      userId
    });
  } catch (error) {
    console.error('Error saving portfolio:', error);
    // Silently fail - this is not critical functionality
  }
};

// Generate a simple user ID (for demo purposes)
export const generateUserId = (): string => {
  // Try to get existing ID from localStorage
  let userId = localStorage.getItem('portfolio-user-id');
  
  if (!userId) {
    // Generate new ID
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('portfolio-user-id', userId);
  }
  
  return userId;
};
