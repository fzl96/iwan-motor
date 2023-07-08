import { createContext, useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [motor, setMotor] = useState<any>([]);
  const [selectedMotor, setSelectedMotor] = useState();
  const [sales, setSales] = useState<any>([]);
  const [merk, setMerk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const motorRef = collection(db, "inventory");
    const salesRef = collection(db, "sales");
    const merkRef = collection(db, "merk");

    const unsubscirbeMotor = onSnapshot(motorRef, (snapshot) => {
      const data: any = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sorted = data.sort((a, b) => {
        const dateA = new Date(a.updatedAt.toDate());
        const dateB = new Date(b.updatedAt.toDate());

        return dateB.getTime() - dateA.getTime();
      });
      setMotor(sorted);
    });

    const unsubscirbeSales = onSnapshot(salesRef, (snapshot) => {
      const data: any = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sorted = data.sort((a, b) => {
        const dateA = new Date(a.tanggal.toDate());
        const dateB = new Date(b.tanggal.toDate());

        return dateB.getTime() - dateA.getTime();
      });
      setSales(sorted);
      setLoading(false);
    });

    const unsubscribeMerk = onSnapshot(merkRef, (snapshot) => {
      const data: { id: string; name: string }[] = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setMerk(data);
    });

    return () => {
      unsubscirbeMotor();
      unsubscirbeSales();
      unsubscribeMerk();
    };
  }, []);

  return (
    <DataContext.Provider
      value={{ motor, sales, loading, selectedMotor, setSelectedMotor, merk }}
    >
      {children}
    </DataContext.Provider>
  );
};
