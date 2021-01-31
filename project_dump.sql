-- Dummy dump data
-- Create Games table
DROP TABLE IF EXISTS `Games`;
CREATE TABLE `Games` (
 `gameID` int(11) not null AUTO_INCREMENT,
 `gameName` varchar(255) not null,
 `gameReleaseYear` int(11),
 `publisherID` int(11),
  PRIMARY KEY (`gameID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- intert dummy data
INSERT INTO `Games`(`gameName`, `gameReleaseYear`, `publisherID`) 
VALUES ('Super Mario',1111,1),('Dr. Mario 64',2222,1),
('Aerobiz Supersonic',1994,2),('Sonic the Hedgehog',1991,2)
,('Sonic Spinball',1993,2),('E.T. the Extra-Terrestrial',1982,3);


-- Create Publishers table
DROP TABLE IF EXISTS `Publishers`;
CREATE TABLE `Publishers` (
 `publisherID` int(11) not null AUTO_INCREMENT,
 `publisherName` varchar(255) not null,
 `yearFounded` int(11),
 `hqCountry` varchar(255),
 `ceo` varchar(255),
  PRIMARY KEY (`publisherID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- intert dummy data
INSERT INTO `Publishers`(`publisherName`, `yearFounded`, `hqCountry`, `ceo`) 
VALUES ('Nintendo',1111,'Japan','Someone 1'),
('Sega',1960,'Japan','Someone 2'),
('Atari',1972,'United States','Someone 3');


-- Create Consoles table
DROP TABLE IF EXISTS `Consoles`;
CREATE TABLE `Consoles` (
 `consoleID` int(11) not null AUTO_INCREMENT,
 `consoleName` varchar(255) not null,
 `consoleDeveloper` varchar(255),
 `consoleType` varchar(255),
  PRIMARY KEY (`consoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- intert dummy data
INSERT INTO `Consoles`(`consoleName`, `consoleDeveloper`, `consoleType`) 
VALUES ('Super Nintendo Entertainment System','Nintendo','Home Console'),
('Nintendo 64','Nintendo','Home Console'),
('Sega Genesis','Sega','Home Console'),
('Atari 2600','Atari','Home Console');


-- Create GamesConsoles table
DROP TABLE IF EXISTS `GamesConsoles`;
CREATE TABLE `GamesConsoles` (
 `gameID` int(11) not null AUTO_INCREMENT,
 `consoleID` int(11),
  CONSTRAINT `game_fk_1` FOREIGN KEY (`gameID`) REFERENCES `Games` (`gameID`),
  CONSTRAINT `game_fk_2` FOREIGN KEY (`consoleID`) REFERENCES `Consoles` (`consoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- intert dummy data
INSERT INTO `GamesConsoles`(`gameID`, `consoleID`) 
VALUES (1,1),(2,2),(3,3),(4,3),(5,3),(6,4);