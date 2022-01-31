import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useSockets } from '../context/socket.context';

import RoomsContainer from '../containers/Rooms';
import MessageContainer from '../containers/Messages';
import { useEffect, useRef } from 'react';

export default function Home() {
  const { socket, username, setUsername } = useSockets();
  const usernameRef = useRef(null);

  function handleSetUsername() {
    const value = usernameRef.current.value;
    if (!value) {
      return;
    }

    setUsername(value);

    localStorage.setItem('username', value); // TODO MongoDB
  }

  useEffect(() => {
    if (usernameRef)
      usernameRef.current.value = localStorage.getItem('username') || ''; // TODO MongoDB
  }, []);

  return (
    <div>
      {!username && (
        <div className={styles.usernameWrapper}>
          <div className={styles.usernameInner}>
            <input placeholder="Username" ref={usernameRef} />
            <button className="cta" onClick={handleSetUsername}>
              START
            </button>
          </div>
        </div>
      )}

      {username && (
        <div className={styles.container}>
          <RoomsContainer />
          <MessageContainer />
        </div>
      )}
    </div>
  );
}
