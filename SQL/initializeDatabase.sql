--
-- Base de données : `groupomania`
--
CREATE DATABASE IF NOT EXISTS `groupomania` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `groupomania`;

-- --------------------------------------------------------

--
-- Structure de la table `answers`
--

DROP TABLE IF EXISTS `answers`;
CREATE TABLE IF NOT EXISTS `answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commentId` int(11) NOT NULL,
  `articleId` int(10) NOT NULL,
  `creatorId` int(11) NOT NULL,
  `pseudo` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `dates` varchar(255) NOT NULL,
  `valide` int(10) NOT NULL,
  `dateofcreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=151 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `articles`
--

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `creatorId` int(11) NOT NULL,
  `message` text NOT NULL,
  `pseudo` varchar(255) NOT NULL,
  `image` text,
  `genre` varchar(255) NOT NULL,
  `dates` varchar(100) NOT NULL,
  `voteFor` int(11) NOT NULL,
  `voteAgainst` int(11) NOT NULL,
  `userFor` text NOT NULL,
  `userAgainst` text NOT NULL,
  `valide` int(11) NOT NULL,
  `repost` varchar(5) NULL,
  `oldPseudo` varchar(255) NOT NULL,
  `dateofcreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=339 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `articleId` int(11) NOT NULL,
  `pseudo` varchar(255) NOT NULL,
  `creatorId` int(11) NOT NULL,
  `message` text NOT NULL,
  `dates` varchar(100) NOT NULL,
  `valide` int(10) NOT NULL,
  `dateofcreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=188 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `pseudo` varchar(255) NOT NULL,
  `rank` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `pseudo`, `rank`) VALUES
(1, 'director@social.dev', '$2b$10$Vciiv9DCZq/tnQqgQMk4Y.Pzb9B/8OGqqVrbZ89.YFtY2hN.X.gmi', 'Directeur', 'BOSS');