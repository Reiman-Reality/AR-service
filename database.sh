#!/bin/bash
echo "Please enter the root MYSQL users password:"

read -s pass

echo "Please choose a database name:"

read dbName

mysql -uroot -p${pass} -e "CREATE DATABASE $dbName"

mysql -uroot -p${pass}  -e "CREATE TABLE $dbName.MARKERS (
  marker_id varchar(36) NOT NULL,
  name varchar(50) DEFAULT NULL,
  file_path_one varchar(1000) DEFAULT NULL,
  file_path_two varchar(1000) DEFAULT NULL,
  file_path_three varchar(1000) DEFAULT NULL,
  inserted_on datetime DEFAULT NULL,
  PRIMARY KEY (marker_id) );"

mysql -uroot -p${pass}  -e "CREATE TABLE $dbName.MODELS (
  model_id varchar(36) NOT NULL,
  file_path varchar(1000) DEFAULT NULL,
  texture_name varchar(1000) DEFAULT NULL,
  inserted_on datetime DEFAULT NULL,
  name varchar(50) DEFAULT NULL,
  PRIMARY KEY (model_id) );"

mysql -uroot -p${pass}  -e "CREATE TABLE $dbName.USER (
  username varchar(36) DEFAULT NULL,
  password varchar(100) DEFAULT NULL,
  role varchar(36) DEFAULT NULL,
  UNIQUE KEY username (username) );"

mysql -uroot -p${pass}  -e "CREATE TABLE $dbName.EVENTS (
  marker_id varchar(36) NOT NULL,
  model_id varchar(36) DEFAULT NULL,
  x_pos int(11) NOT NULL DEFAULT 0,
  y_pos int(11) NOT NULL DEFAULT 0,
  z_pos int(11) NOT NULL DEFAULT 0,
  x_rot int(11) DEFAULT 0,
  y_rot int(11) DEFAULT 0,
  z_rot int(11) DEFAULT 0,
  scale int(11) DEFAULT 1,
  tag varchar(50) DEFAULT NULL,
  KEY marker_id (marker_id),
  KEY model_id_two (model_id),
  CONSTRAINT EVENTS_ibfk_1 FOREIGN KEY (marker_id) REFERENCES MARKERS (marker_id),
  CONSTRAINT EVENTS_ibfk_3 FOREIGN KEY (model_id) REFERENCES MODELS (model_id) ); "

echo "If no errors are listed above, the database was created successfully!"
echo "Please update your .env file to use the database name you selected."
