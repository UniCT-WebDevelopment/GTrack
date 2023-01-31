-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Creato il: Gen 31, 2023 alle 14:32
-- Versione del server: 5.6.35
-- Versione PHP: 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `GTrack`
--

CREATE DATABASE IF NOT EXISTS GTrack;
USE GTrack;

-- --------------------------------------------------------

--
-- Struttura della tabella `customers`
--

CREATE TABLE `customers` (
  `uid` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `phoneNumber` varchar(100) NOT NULL,
  `businessName` varchar(100) NOT NULL,
  `address` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `customers`
--

INSERT INTO `customers` (`uid`, `email`, `name`, `surname`, `phoneNumber`, `businessName`, `address`) VALUES
(1, 'simoncello98@yahoo.it', 'Simone', 'Scionti', '3913521516', '45267873652', '{\"streetName\":\"viale giuseppe lain\\u00F2\",\"streetNumber\":\"5\",\"city\":\"Catania\",\"postalCode\":\"95100\",\"region\":\"Sicilia\",\"state\":\"Italia\"}');

-- --------------------------------------------------------

--
-- Struttura della tabella `drivers`
--

CREATE TABLE `drivers` (
  `uid` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `phoneNumber` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `drivers`
--

INSERT INTO `drivers` (`uid`, `email`, `name`, `surname`, `phoneNumber`) VALUES
(1, 'simoncello98@yahoo.it', 'Ottavio', 'Scionti', '3913521516');

-- --------------------------------------------------------

--
-- Struttura della tabella `interventions`
--

CREATE TABLE `interventions` (
  `uid` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `trip` varchar(100) DEFAULT NULL,
  `description` text,
  `price` double NOT NULL,
  `paymentDetails` varchar(100) NOT NULL,
  `payedBy` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  `date` datetime NOT NULL,
  `track` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `interventions`
--

INSERT INTO `interventions` (`uid`, `code`, `trip`, `description`, `price`, `paymentDetails`, `payedBy`, `type`, `date`, `track`) VALUES
(9, 'bya9', NULL, NULL, 400, 'Card', 'Driver', 'Truck', '2023-01-23 23:00:00', ''),
(10, 'd8TM', NULL, NULL, 200, 'Card', 'Company', 'Truck', '2023-01-15 23:00:00', '5'),
(12, '7xly', '2', NULL, 3, 'Card', 'Driver', 'Truck', '2023-01-17 23:00:00', '6'),
(13, 'Z4Uu', '2', NULL, 2, 'Card', 'Company', 'Truck', '2023-01-24 23:00:00', '5'),
(14, 'eRRw', '2', NULL, 4, 'Card', 'Company', 'Trailer', '2023-01-23 23:00:00', '6');

-- --------------------------------------------------------

--
-- Struttura della tabella `packages`
--

CREATE TABLE `packages` (
  `uid` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `inboundStageUid` varchar(100) DEFAULT NULL,
  `outboundstageUid` varchar(100) DEFAULT NULL,
  `inboundTripUid` varchar(100) DEFAULT NULL,
  `outboundTripUid` varchar(100) DEFAULT NULL,
  `measures` text NOT NULL,
  `creationDate` datetime NOT NULL,
  `type` varchar(100) NOT NULL,
  `estimatedDestinationArea` varchar(100) NOT NULL,
  `estimatedDestinationAddress` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `packages`
--

INSERT INTO `packages` (`uid`, `code`, `description`, `inboundStageUid`, `outboundstageUid`, `inboundTripUid`, `outboundTripUid`, `measures`, `creationDate`, `type`, `estimatedDestinationArea`, `estimatedDestinationAddress`) VALUES
(1, 'dFIH', 'Colli azienda 1', '8', '6', '2', '3', '{\"weight\":5,\"length\":5,\"height\":4,\"width\":4}', '2023-01-19 11:36:57', 'Pedane', 'CT', '{\"streetName\":\"viale giuseppe lain\\u00F2\",\"streetNumber\":\"5\",\"city\":\"Catania\",\"postalCode\":\"95100\",\"region\":\"Sicilia\",\"state\":\"Italia\"}'),
(2, 'X8cE', 'Colli azienda 2', '5', '6', '2', '3', '{\"weight\":10,\"length\":20,\"height\":20,\"width\":30}', '2023-01-20 09:12:27', 'Package', 'PA', '{\"streetName\":\"bl.understov\",\"streetNumber\":\"23A\",\"city\":\"Catania\",\"postalCode\":\"25673\",\"region\":\"Sicily\",\"state\":\"Satte\"}'),
(3, '0TOY', 'Descrizione', '5', '6', '2', '3', '{\"weight\":3,\"length\":3,\"height\":2,\"width\":2}', '2023-01-23 20:24:30', 'Pedane', 'PA', '{\"streetName\":\"viale giuseppe lain\\u00F2\",\"streetNumber\":\"5\",\"city\":\"Catania\",\"postalCode\":\"95100\",\"region\":\"Sicily\",\"state\":\"Italia\"}');

-- --------------------------------------------------------

--
-- Struttura della tabella `tracks`
--

CREATE TABLE `tracks` (
  `uid` int(11) NOT NULL,
  `licensePlate` varchar(100) NOT NULL,
  `manufacturer` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `km` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `expiration` text NOT NULL,
  `vehicleTax` datetime NOT NULL,
  `inspection` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `tracks`
--

INSERT INTO `tracks` (`uid`, `licensePlate`, `manufacturer`, `model`, `km`, `type`, `expiration`, `vehicleTax`, `inspection`) VALUES
(5, 'GF534MC', 'Mercedes', 'a45', 30000, 'Truck', '{\"effectiveDate\":\"2023-01-17T23:00:00Z\",\"cost\":390,\"paymentMethod\":\"Cash\"}', '2023-01-23 23:00:00', '2023-01-30 23:00:00'),
(6, 'FY149GD', 'Citroen', 'c4', 30000, 'Trailer', '{\"effectiveDate\":\"2023-01-30T23:00:00Z\",\"cost\":400,\"paymentMethod\":\"Cash\"}', '2023-01-30 23:00:00', '2023-01-30 23:00:00'),
(7, 'AD456CD', 'dddgd', 'ddhoid', 22222, 'Trailer', '{\"effectiveDate\":\"2023-01-23T23:00:00Z\",\"cost\":300,\"paymentMethod\":\"Card\"}', '2023-01-23 23:00:00', '2023-01-22 23:00:00'),
(8, 'FY149GF', 'Citroen', '208', 3, 'Trailer', '{\"effectiveDate\":\"2023-01-29T23:00:00Z\",\"cost\":2,\"paymentMethod\":\"Cash\"}', '2023-01-30 23:00:00', '2023-01-30 23:00:00');

-- --------------------------------------------------------

--
-- Struttura della tabella `tripCosts`
--

CREATE TABLE `tripCosts` (
  `uid` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `trip` varchar(100) DEFAULT NULL,
  `date` datetime NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `price` double NOT NULL,
  `paymentDetails` varchar(100) NOT NULL,
  `payedBy` varchar(100) NOT NULL,
  `fuelStation` varchar(100) DEFAULT NULL,
  `liters` double DEFAULT NULL,
  `startLocation` varchar(100) DEFAULT NULL,
  `destination` varchar(100) DEFAULT NULL,
  `type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `trips`
--

CREATE TABLE `trips` (
  `uid` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `amount` int(11) NOT NULL,
  `earnings` int(11) NOT NULL,
  `driver` varchar(100) NOT NULL,
  `track` varchar(100) NOT NULL,
  `km` int(11) NOT NULL,
  `trailer` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `activeHoursPerDay` int(11) NOT NULL,
  `durationHours` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `trips`
--

INSERT INTO `trips` (`uid`, `code`, `startDate`, `endDate`, `amount`, `earnings`, `driver`, `track`, `km`, `trailer`, `category`, `activeHoursPerDay`, `durationHours`) VALUES
(2, 'ZWLF', '2023-01-17 19:00:00', '2023-01-30 19:00:00', 0, 0, '1', '5', 30000, '6', 'Line Trip', 8, 0),
(3, '1hKh', '2023-01-20 23:00:00', '2023-01-30 23:00:00', 0, 0, '1', '5', 200, '6', 'Sorting Trip', 3, 0);

-- --------------------------------------------------------

--
-- Struttura della tabella `tripStages`
--

CREATE TABLE `tripStages` (
  `uid` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `trip` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  `date` datetime NOT NULL,
  `address` text NOT NULL,
  `documents` varchar(100) NOT NULL,
  `customer` varchar(100) NOT NULL,
  `stateLog` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `tripStages`
--

INSERT INTO `tripStages` (`uid`, `code`, `trip`, `type`, `date`, `address`, `documents`, `customer`, `stateLog`) VALUES
(5, 'LYJV', '2', 'Withdraw', '2023-01-17 22:00:00', '{\"streetName\":\"viale giuseppe lain\\u00F2\",\"streetNumber\":\"5\",\"city\":\"Catania\",\"postalCode\":\"95100\",\"region\":\"Sicilia\",\"state\":\"Italia\"}', '', '1', '[{\"date\":\"2023-01-17T22:00:00.000Z\",\"state\":\"In Withdraw\"},{\"date\":\"2023-01-17T22:00:00.000Z\",\"state\":\"Withdrawed\"}]'),
(6, '-2M0', '3', 'Delivery', '2023-01-20 23:00:00', '{\"streetName\":\"viale giuseppe lain\\u00F2\",\"streetNumber\":\"5\",\"city\":\"Catania\",\"postalCode\":\"95100\",\"region\":\"Sicilia\",\"state\":\"Italia\"}', '', '1', NULL),
(7, 'alkI', '2', 'Withdraw', '2023-01-22 23:00:00', '{\"streetName\":\"viale giuseppe lain\\u00F2\",\"streetNumber\":\"5\",\"city\":\"Catania\",\"postalCode\":\"95100\",\"region\":\"Sicilia\",\"state\":\"Italia\"}', '', '1', '[{\"date\":\"2023-01-22T23:00:00.000Z\",\"state\":\"In Withdraw\"},{\"date\":\"2023-01-22T23:00:00.000Z\",\"state\":\"Withdrawed\"}]'),
(8, 'a2rN', '2', 'Withdraw', '2023-01-25 23:00:00', '{\"streetName\":\"viale giuseppe lain\\u00F2\",\"streetNumber\":\"5\",\"city\":\"Catania\",\"postalCode\":\"95100\",\"region\":\"Sicilia\",\"state\":\"Italia\"}', '', '1', NULL),
(9, '-VL8', '3', 'Delivery', '2023-01-23 23:00:00', '{\"streetName\":\"viale giuseppe lain\\u00F2\",\"streetNumber\":\"5\",\"city\":\"Catania\",\"postalCode\":\"95100\",\"region\":\"Sicilia\",\"state\":\"Italia\"}', '', '1', '[{\"date\":\"2023-01-23T23:00:00.000Z\",\"state\":\"In Delivery\"},{\"date\":\"2023-01-23T23:00:00.000Z\",\"state\":\"Deliveried\"}]');

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `phoneNumber` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `lastLogout` datetime DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'operator'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`uid`, `email`, `name`, `surname`, `phoneNumber`, `password`, `lastLogin`, `lastLogout`, `role`) VALUES
(1, 'admin@gtrack.com', 'Admin', 'Gtrack', '3335556666', '2e33a9b0b06aa0a01ede70995674ee23', '2023-01-31 11:03:22', '2023-01-23 09:05:36', 'admin'),
(2, 'operator@gtrack.com', 'Operator', 'GTrack', '3913521516', '63eebfdcad8f3b379dca7d19ec8edfb1', '2023-01-31 02:11:09', '2023-01-24 16:43:52', 'operator');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`uid`);

--
-- Indici per le tabelle `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`uid`);

--
-- Indici per le tabelle `interventions`
--
ALTER TABLE `interventions`
  ADD PRIMARY KEY (`uid`);

--
-- Indici per le tabelle `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`uid`);

--
-- Indici per le tabelle `tracks`
--
ALTER TABLE `tracks`
  ADD PRIMARY KEY (`uid`);

--
-- Indici per le tabelle `tripCosts`
--
ALTER TABLE `tripCosts`
  ADD PRIMARY KEY (`uid`);

--
-- Indici per le tabelle `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`uid`);

--
-- Indici per le tabelle `tripStages`
--
ALTER TABLE `tripStages`
  ADD PRIMARY KEY (`uid`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `customers`
--
ALTER TABLE `customers`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT per la tabella `drivers`
--
ALTER TABLE `drivers`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT per la tabella `interventions`
--
ALTER TABLE `interventions`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT per la tabella `packages`
--
ALTER TABLE `packages`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT per la tabella `tracks`
--
ALTER TABLE `tracks`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT per la tabella `tripCosts`
--
ALTER TABLE `tripCosts`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT per la tabella `trips`
--
ALTER TABLE `trips`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT per la tabella `tripStages`
--
ALTER TABLE `tripStages`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;