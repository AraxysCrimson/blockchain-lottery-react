// src/components/HomePage.js
import React from 'react';
import CountdownBanner from './CountdownBanner';
import Dashboard from './Dashboard';
import InfoSection from './InfoSection';
import PlayersList from './PlayersList';
import TransactionHistory from './TransactionHistory';

function HomePage({
  timeUntilDraw,
  formatDrawTime,
  balance,
  players,
  accountBalance,
  isPlayerParticipating,
  value,
  setValue,
  onSubmit,
  isLoading,
  isManager,
  pickWinner,
  currentAccount,
  winner,
  winAmount,
  manager,
  message,
  shortenAddress
}) {
  return (
    <>
      <CountdownBanner 
        timeUntilDraw={timeUntilDraw} 
        formatDrawTime={formatDrawTime}
        sloganChangeInterval={3000}
      />

      <Dashboard 
        balance={balance}
        players={players}
        accountBalance={accountBalance}
        isPlayerParticipating={isPlayerParticipating}
        value={value}
        setValue={setValue}
        onSubmit={onSubmit}
        isLoading={isLoading}
        isManager={isManager}
        pickWinner={pickWinner}
        currentAccount={currentAccount}
      />

      <InfoSection 
        winner={winner}
        winAmount={winAmount}
        manager={manager}
        currentAccount={currentAccount}
        message={message}
        shortenAddress={shortenAddress}
      />

      {players.length > 0 && (
        <PlayersList 
          players={players}
          currentAccount={currentAccount}
          shortenAddress={shortenAddress}
        />
      )}

      <TransactionHistory 
        currentAccount={currentAccount}
        shortenAddress={shortenAddress}
        isManager={isManager}
      />
    </>
  );
}

export default HomePage;
