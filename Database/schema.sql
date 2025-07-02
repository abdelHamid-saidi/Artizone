-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 03 juin 2025 à 11:03
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `artizone`
--

-- --------------------------------------------------------

--
-- Structure de la table `administrateurs`
--

DROP TABLE IF EXISTS `administrateurs`;
CREATE TABLE IF NOT EXISTS `administrateurs` (
  `id` char(36) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `motDePasse` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `particuliers`
--

DROP TABLE IF EXISTS `particuliers`;
CREATE TABLE IF NOT EXISTS `particuliers` (
  `id` char(36) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `motDePasse` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `artisans`
--

DROP TABLE IF EXISTS `artisans`;
CREATE TABLE IF NOT EXISTS `artisans` (
  `id` char(36) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `langue` varchar(50) DEFAULT NULL,
  `noteMoyenne` float DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `pays` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` char(36) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text,
  `icone` varchar(50) DEFAULT NULL,
  `couleur` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `adresses_particulier`
--

DROP TABLE IF EXISTS `adresses_particulier`;
CREATE TABLE IF NOT EXISTS `adresses_particulier` (
  `id` char(36) NOT NULL,
  `rue` varchar(255) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `codePostal` varchar(20) DEFAULT NULL,
  `pays` varchar(50) DEFAULT NULL,
  `particulierId` char(36) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `particulierId` (`particulierId`),
  CONSTRAINT `fk_adresse_particulier` FOREIGN KEY (`particulierId`) REFERENCES `particuliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `adresses_artisan`
--

DROP TABLE IF EXISTS `adresses_artisan`;
CREATE TABLE IF NOT EXISTS `adresses_artisan` (
  `id` char(36) NOT NULL,
  `rue` varchar(255) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `codePostal` varchar(20) DEFAULT NULL,
  `pays` varchar(50) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `artisanId` char(36) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `artisanId` (`artisanId`),
  CONSTRAINT `fk_adresse_artisan` FOREIGN KEY (`artisanId`) REFERENCES `artisans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` char(36) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `description` text,
  `prixUnitaire` float DEFAULT NULL,
  `dureeEstimee` varchar(50) DEFAULT NULL,
  `artisanId` char(36) NOT NULL,
  `categorieId` char(36) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `artisanId` (`artisanId`),
  KEY `categorieId` (`categorieId`),
  CONSTRAINT `fk_service_artisan` FOREIGN KEY (`artisanId`) REFERENCES `artisans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_service_categorie` FOREIGN KEY (`categorieId`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `disponibilites`
--

DROP TABLE IF EXISTS `disponibilites`;
CREATE TABLE IF NOT EXISTS `disponibilites` (
  `id` char(36) NOT NULL,
  `jour` varchar(20) DEFAULT NULL,
  `heureDebut` time DEFAULT NULL,
  `heureFin` time DEFAULT NULL,
  `isDisponible` tinyint(1) DEFAULT NULL,
  `artisanId` char(36) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `artisanId` (`artisanId`),
  CONSTRAINT `fk_disponibilite_artisan` FOREIGN KEY (`artisanId`) REFERENCES `artisans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
CREATE TABLE IF NOT EXISTS `commandes` (
  `id` char(36) NOT NULL,
  `dateCommande` datetime DEFAULT NULL,
  `statut` varchar(50) DEFAULT NULL,
  `description` text,
  `prixTotal` float DEFAULT NULL,
  `particulierId` char(36) NOT NULL,
  `serviceId` char(36) NOT NULL,
  `disponibiliteId` char(36) NOT NULL,
  `adresseParticulierId` char(36) NOT NULL,
  `artisanId` char(36) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `particulierId` (`particulierId`),
  KEY `serviceId` (`serviceId`),
  KEY `disponibiliteId` (`disponibiliteId`),
  KEY `adresseParticulierId` (`adresseParticulierId`),
  KEY `artisanId` (`artisanId`),
  CONSTRAINT `fk_commande_particulier` FOREIGN KEY (`particulierId`) REFERENCES `particuliers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_commande_service` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_commande_disponibilite` FOREIGN KEY (`disponibiliteId`) REFERENCES `disponibilites` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_commande_adresse` FOREIGN KEY (`adresseParticulierId`) REFERENCES `adresses_particulier` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_commande_artisan` FOREIGN KEY (`artisanId`) REFERENCES `artisans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `paiements`
--

DROP TABLE IF EXISTS `paiements`;
CREATE TABLE IF NOT EXISTS `paiements` (
  `id` char(36) NOT NULL,
  `montant` float DEFAULT NULL,
  `methode` varchar(50) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `statut` varchar(50) DEFAULT NULL,
  `commandeId` char(36) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `commandeId` (`commandeId`),
  CONSTRAINT `fk_paiement_commande` FOREIGN KEY (`commandeId`) REFERENCES `commandes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `avis`
--

DROP TABLE IF EXISTS `avis`;
CREATE TABLE IF NOT EXISTS `avis` (
  `id` char(36) NOT NULL,
  `note` int DEFAULT NULL,
  `commentaire` text,
  `date` datetime DEFAULT NULL,
  `particulierId` char(36) DEFAULT NULL,
  `commandeId` char(36) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `commandeId` (`commandeId`),
  KEY `particulierId` (`particulierId`),
  CONSTRAINT `fk_avis_commande` FOREIGN KEY (`commandeId`) REFERENCES `commandes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_avis_particulier` FOREIGN KEY (`particulierId`) REFERENCES `particuliers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `contenu` text,
  `dateEnvoi` datetime DEFAULT NULL,
  `statut` varchar(50) DEFAULT NULL,
  `particulierId` char(36) DEFAULT NULL,
  `administrateurId` char(36) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `particulierId` (`particulierId`),
  KEY `administrateurId` (`administrateurId`),
  CONSTRAINT `fk_notification_particulier` FOREIGN KEY (`particulierId`) REFERENCES `particuliers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_notification_administrateur` FOREIGN KEY (`administrateurId`) REFERENCES `administrateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;