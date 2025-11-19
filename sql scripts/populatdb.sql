-- =====================================================
-- SQL Script to populate database from BRT_tracker_projection_ABEL.xlsx
-- Generated on: 2025-11-19 02:23:03
-- =====================================================

-- =====================================================
-- CLEAR EXISTING DATA
-- =====================================================

-- Delete existing data in reverse order of dependencies
DELETE FROM Risks;
DELETE FROM Milestones;
DELETE FROM Tasks;

-- Reset identity seeds (optional - use if you want IDs to start from 1)
DBCC CHECKIDENT ('Tasks', RESEED, 0);
DBCC CHECKIDENT ('Milestones', RESEED, 0);
DBCC CHECKIDENT ('Risks', RESEED, 0);

-- =====================================================
-- TASKS
-- =====================================================

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('1.1', 'Génie civil', 'Études', 'Études d''exécution tracés liaisons HTA (plans/profils)', 'N/A', 'Corridor BRT', 0, 'km', 0, '2026-01-19', '2026-03-30', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('1.2', 'Postes Sources (ext.)', 'Études', 'Dossiers d''exécution extensions 5 postes sources', 'Postes Sources', 'YOPOUGON1/PLATEAU/BIA N./DJIBI/RIVIERA', 5, 'postes', 0, '2026-01-19', '2026-03-30', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('1.3', 'Postes de Livraison (PL)', 'Études', 'Dossiers d''exécution 6 PL (protections, schémas, plans)', 'PL', 'Ouest/Est', 6, 'PL', 0, '2026-01-19', '2026-03-30', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('1.4', 'Mini‑stations', 'Études', 'Notes de calcul transformateurs & TGBT mini‑stations', 'Mini-stations', '27 MS', 27, 'MS', 0, '2026-01-19', '2026-03-30', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('1.5', 'Téléconduite/SCADA', 'Études', 'Spécification RTU/ITI, télécom & points SCADA', 'RTU/ITI', 'Réseau BRT', 0, 'sites', 0, '2026-01-19', '2026-03-30', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('2.1', 'Génie civil', 'Travaux', 'Tranchées & fourreaux Ø160 – sections urbaines', 'Fourreaux', 'Corridor urbain', 0, 'km', 0, '2026-03-16', '2026-11-23', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('2.2', 'Liaisons HTA', 'Travaux', 'Pose câble 12/20 kV Djibi → ST20', 'Câble HTA', 'Djibi–ST20', 0, 'km', 0, '2026-04-13', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('2.3', 'Liaisons HTA', 'Travaux', 'Pose câble 12/20 kV Riviera → Dépôt Est', 'Câble HTA', 'Riviera–Dépôt Est', 0, 'km', 0, '2026-04-13', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('2.4', 'Liaisons HTA', 'Travaux', 'Pose câble 12/20 kV BIA Nord → ST9', 'Câble HTA', 'BIA Nord–ST9', 0, 'km', 0, '2026-04-13', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('2.5', 'Liaisons HTA', 'Travaux', 'Pose câble 12/20 kV BIA Nord → ST11', 'Câble HTA', 'BIA Nord–ST11', 0, 'km', 0, '2026-04-13', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('2.6', 'Liaisons HTA', 'Travaux', 'Pose câble 12/20 kV – autres sections (solde)', 'Câble HTA', 'Divers corridor', 0, 'km', 0, '2026-04-13', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('3.1', 'Postes Sources (ext.)', 'Travaux', 'Extension poste source : cellules départ, protections, adaptation 20 kV', 'Poste source', 'YOPOUGON1', 1, 'poste', 0, '2026-05-11', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('3.2', 'Postes Sources (ext.)', 'Travaux', 'Extension poste source : cellules départ, protections, adaptation 20 kV', 'Poste source', 'PLATEAU', 1, 'poste', 0, '2026-05-11', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('3.3', 'Postes Sources (ext.)', 'Travaux', 'Extension poste source : cellules départ, protections, adaptation 20 kV', 'Poste source', 'BIA NORD', 1, 'poste', 0, '2026-05-11', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('3.4', 'Postes Sources (ext.)', 'Travaux', 'Extension poste source : cellules départ, protections, adaptation 20 kV', 'Poste source', 'DJIBI', 1, 'poste', 0, '2026-05-11', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('3.5', 'Postes Sources (ext.)', 'Travaux', 'Extension poste source : cellules départ, protections, adaptation 20 kV', 'Poste source', 'RIVIERA', 1, 'poste', 0, '2026-05-11', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('4.1', 'Postes de Livraison (PL)', 'Travaux', 'Fourniture & installation PL (tableaux HTA, protections, SCADA)', 'PL', 'D.O.', 1, 'PL', 0, '2026-05-25', '2027-02-01', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('4.2', 'Postes de Livraison (PL)', 'Travaux', 'Fourniture & installation PL (tableaux HTA, protections, SCADA)', 'PL', 'ST7', 1, 'PL', 0, '2026-05-25', '2027-02-01', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('4.3', 'Postes de Livraison (PL)', 'Travaux', 'Fourniture & installation PL (tableaux HTA, protections, SCADA)', 'PL', 'ST9', 1, 'PL', 0, '2026-05-25', '2027-02-01', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('4.4', 'Postes de Livraison (PL)', 'Travaux', 'Fourniture & installation PL (tableaux HTA, protections, SCADA)', 'PL', 'ST11', 1, 'PL', 0, '2026-05-25', '2027-02-01', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('4.5', 'Postes de Livraison (PL)', 'Travaux', 'Fourniture & installation PL (tableaux HTA, protections, SCADA)', 'PL', 'ST20', 1, 'PL', 0, '2026-05-25', '2027-02-01', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('4.6', 'Postes de Livraison (PL)', 'Travaux', 'Fourniture & installation PL (tableaux HTA, protections, SCADA)', 'PL', 'D.E.', 1, 'PL', 0, '2026-05-25', '2027-02-01', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('5.1', 'Postes de Répartition (PR)', 'Travaux', 'Fourniture & installation PR (liaisons/couplages)', 'PR', 'PR1', 1, 'PR', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('5.2', 'Postes de Répartition (PR)', 'Travaux', 'Fourniture & installation PR (liaisons/couplages)', 'PR', 'PR2', 1, 'PR', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('5.3', 'Postes de Répartition (PR)', 'Travaux', 'Fourniture & installation PR (liaisons/couplages)', 'PR', 'PR3', 1, 'PR', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('5.4', 'Postes de Répartition (PR)', 'Travaux', 'Fourniture & installation PR (liaisons/couplages)', 'PR', 'PR4', 1, 'PR', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('5.5', 'Postes de Répartition (PR)', 'Travaux', 'Fourniture & installation PR (liaisons/couplages)', 'PR', 'PR5', 1, 'PR', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('5.6', 'Postes de Répartition (PR)', 'Travaux', 'Fourniture & installation PR (liaisons/couplages)', 'PR', 'PR6', 1, 'PR', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.1', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS1', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.2', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS2', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.3', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS3', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.4', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS4', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.5', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS5', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.6', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS6', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.7', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS7', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.8', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS8', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.9', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS9', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.10', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS10', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.11', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS11', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.12', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS12', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.13', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS13', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.14', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS14', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.15', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS15', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.16', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS16', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.17', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS17', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.18', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS18', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.19', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS19', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.20', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS20', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.21', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS21', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.22', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS22', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.23', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS23', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.24', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS24', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.25', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS25', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.26', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS26', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('6.27', 'Mini‑stations', 'Travaux', 'Installation mini‑station 15/0,4 kV + TGBT (800–2000 kVA)', 'Mini‑station', 'MS27', 1, 'MS', 0, '2026-06-08', '2027-01-18', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('7.1', 'Téléconduite/SCADA', 'Travaux', 'Installation RTU/ITI & capteurs (états/mesures)', 'RTU/ITI', 'Sites PL/PR/MS', 0, 'sites', 0, '2026-07-06', '2027-03-15', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('7.2', 'Téléconduite/SCADA', 'Travaux', 'Intégration centre de contrôle (IEC 104/61850), liaisons télécom', 'SCADA', 'Centre BRT', 1, 'centre', 0, '2026-07-06', '2027-03-15', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('8.1', 'Essais & MES', 'Essais', 'FAT usines (cellules, RTU/ITI, protections)', 'FAT', 'Usines', 0, 'lots', 0, '2026-12-21', '2027-05-10', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('8.2', 'Essais & MES', 'Essais', 'SAT sur site (fonctionnels/communications)', 'SAT', 'Sites', 0, 'sites', 0, '2026-12-21', '2027-05-10', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());

INSERT INTO Tasks (Wbs, Workstream, Phase, Activity, Asset, Location, Quantity, Unit, Weight, StartPlanned, EndPlanned, StartBaseline, EndBaseline, StartActual, EndActual, Progress, Status, Responsible, Dependencies, Comments, CreatedAt, UpdatedAt)
VALUES ('8.3', 'Essais & MES', 'Mise en service', 'Mise en service progressive par tronçons', 'MES', 'Tronçons Ouest/Est', 2, 'tronçons', 0, '2027-05-10', '2027-07-05', NULL, NULL, NULL, NULL, 0.0, 'Non démarré', 'N/A', NULL, NULL, GETDATE(), GETDATE());


-- =====================================================
-- MILESTONES
-- =====================================================

INSERT INTO Milestones (Code, Title, Workstream, DatePlanned, DateActual, Status, Comments, LinkedTaskIds, CreatedAt, UpdatedAt)
VALUES ('M1', 'Validation Dossiers d''exécution (tous lots)', 'Études', '2026-03-30', NULL, 'Planifié', NULL, '[]', GETDATE(), GETDATE());

INSERT INTO Milestones (Code, Title, Workstream, DatePlanned, DateActual, Status, Comments, LinkedTaskIds, CreatedAt, UpdatedAt)
VALUES ('M2', 'Achats approuvés (cellules, transfo, RTU/ITI, câbles)', 'Achat', '2026-05-11', NULL, 'Planifié', NULL, '[]', GETDATE(), GETDATE());

INSERT INTO Milestones (Code, Title, Workstream, DatePlanned, DateActual, Status, Comments, LinkedTaskIds, CreatedAt, UpdatedAt)
VALUES ('M3', 'Fin génie civil prioritaire (traversées critiques)', 'Génie civil', '2026-11-23', NULL, 'Planifié', NULL, '[]', GETDATE(), GETDATE());

INSERT INTO Milestones (Code, Title, Workstream, DatePlanned, DateActual, Status, Comments, LinkedTaskIds, CreatedAt, UpdatedAt)
VALUES ('M4', 'Bouclage liaisons HTA Ouest/Est', 'Liaisons HTA', '2027-01-18', NULL, 'Planifié', NULL, '[]', GETDATE(), GETDATE());

INSERT INTO Milestones (Code, Title, Workstream, DatePlanned, DateActual, Status, Comments, LinkedTaskIds, CreatedAt, UpdatedAt)
VALUES ('M5', 'PL/PR opérationnels (tests site OK)', 'Postes de Livraison (PL)', '2027-02-01', NULL, 'Planifié', NULL, '[]', GETDATE(), GETDATE());

INSERT INTO Milestones (Code, Title, Workstream, DatePlanned, DateActual, Status, Comments, LinkedTaskIds, CreatedAt, UpdatedAt)
VALUES ('M6', 'SCADA relié au centre & stable', 'Téléconduite/SCADA', '2027-03-15', NULL, 'Planifié', NULL, '[]', GETDATE(), GETDATE());

INSERT INTO Milestones (Code, Title, Workstream, DatePlanned, DateActual, Status, Comments, LinkedTaskIds, CreatedAt, UpdatedAt)
VALUES ('M7', 'Mise en service Ouest', 'Essais & MES', '2027-06-01', NULL, 'Planifié', NULL, '[]', GETDATE(), GETDATE());

INSERT INTO Milestones (Code, Title, Workstream, DatePlanned, DateActual, Status, Comments, LinkedTaskIds, CreatedAt, UpdatedAt)
VALUES ('M8', 'Mise en service Est', 'Essais & MES', '2027-07-05', NULL, 'Planifié', NULL, '[]', GETDATE(), GETDATE());


-- =====================================================
-- RISKS
-- =====================================================
