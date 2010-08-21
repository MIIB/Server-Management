<?php
		
	//this file is a component that do transaction with database
	//and exist in database layer
	
	//this variable use for prevented redeclarition cDbInterface class
	//when include it in many classes at one class
		
	class cDbInterface
	{
		/*config connection to database*/
		var $_host = "localhost";
		var $_user = "root";
		var $_password = "";
		var $_db;
		//Variables that will hold data within the class
		var $_connection;
		var $_result;
		var $_selecteditems ;
		var $_items = array();
		
		//Constructor, creates a valid connection inside the class
		function cDbInterface($database)
		{
			$this->_db =$database;
			$this->_selecteditems = 0 ;
		    $this->_connection = $this->hookUpDb();
		}
		
		//Generates the connection with the database and returns a
		//valid connection for the one calling.
		function hookUpDb()
		{
		    /*connect to the database*/
		    if(mysql_connect($this->_host,$this->_user,$this->_password))
		    {
				$this->_connection = mysql_connect($this->_host,$this->_user,$this->_password);	       	
		       	mysql_select_db($this->_db/*, $this->_connection*/);		       	
				return $this->_connection;
		    }
		    else
		    {
		       return mysql_error();
		    }
		}
		/////////////////////////////////////////////////////
		////////////////////// Generic QueryAskers///////////
		
		//Use this when no returned result is excepted.
		//Takes correct SQL as a string
		//returns true or mysql_error.
		function doQuery($sql)
		{			
			return mysql_query($sql,$this->_connection) or die($sql."\n".mysql_error());
		}	
		
		//Use this when you expect a result back form the database
		//Takes correct SQL as a string
		//Returns a 2 dimensional array with the result.
		function doQueryResult($sql)
		{
			$this->_items = "";
			 if($sql != "")
			{
				$this->_result = mysql_query($sql,$this->_connection) or die($sql."\n".mysql_error());
				$item = array();
				while($item = mysql_fetch_array($this->_result, MYSQL_ASSOC))
				{
					$this->_items[] = $item;
					$this->_selecteditems++;
				}
				return $this->_items ;
				mysql_free_result($this->_result);
		    	}
		    	else
			{
				die($sql."\n".mysql_error());
			}
		}
		
		//Use this when you want to delete rows from tables
		//Takes correct Tables as a Array of string and Conditions as Strings
		//returns true or mysql_error.
		function doDelete ($TabelsArr , $Condition )
		{
			$ErrorArr = array() ;
		    $i = 0 ;
		    foreach ($TabelsArr as $value)
			{
			     $query = "DELETE FROM " . $value . " WHERE " . $Condition ;
				 $ErrorArr[$i] = $this->doquery($query) ;
				 $i++ ; 		
			}
			return $ErrorArr ;
		} 
	
		//Use this when you want to delete rows from a table 
		//Take correct Table as a string and Conditions as Strings too
		//returns true or mysql_error.   
		function doDelete2 ($table , $condition,$da)
		{
			$query = "DELETE FROM " . $table . " WHERE " . $condition ;
			return $this->doQuery($query) ;
		}
		
		//Use this when you want to Insert rows into tables
		//Takes correct Tables as a Array of string , Columns as a String and Values as string  
		//You can set $cols to "" if you want to enter all of columns
		//returns an array which has 1--> successful Insert and mysql_error--> unsuccessful Insert
		function doInsert ($TabelsArr , $Cols ,$Vals )
		{ 
			$ErrorArr = array() ;
			$i = 0 ;
			if ( $Cols !="")
			{ 		 
		    	foreach ($TabelsArr as $value)
		    	{
					$query = "INSERT INTO " . $value . " ( ". $Cols. " )" ." VALUES (" . $Vals . " ) " ; 
		            $ErrorArr[$i] = $this->doquery($query) ;
					$i++ ; 		
		     	}
		  	}
		 	else
		  	{
			 	foreach ($TabelsArr as $value)
		    	{
					$query = "INSERT INTO " . $value ." VALUES (" . $Vals . " ) " ; 
					$ErrorArr[$i] = $this->doquery($query) ;
					$i++ ; 		
		    	}  
		  	}
		  	return $ErrorArr ;
		}
		
		//Use this when you want to Insert rows into a table
		//Takes correct Table as a string , Columns as a String and Values as string  
		//You can set $cols to "" if you want to enter all of columns
		//returns true or mysql_error.   
		function doInsert2 ($table , $cols ,$vals )
		{ 
			
			$strCols = "" ;
			$strVals = "" ;
				
			if ( count($cols) !=0)
			{ 		 
				for ($i=0 ; $i < count($cols) ; $i++)
				{
					if ($i<count($cols)-1)
					{
						$strCols = $strCols . $cols[$i] . ", " ;
						$strVals = $strVals .  "'" . $vals[$i] ."' , ";
					}
					else 
					{
						$strCols = $strCols . $cols[$i] ;
						$strVals = $strVals . "'" .$vals[$i] . "'" ;
					}
				}
				$query = "INSERT INTO " . $table . " ( ". $strCols. " )" ." VALUES (" . $strVals . " ) " ; 
			}
		  	else
		 	{
			  	for ($i=0 ; $i < count($cols) ; $i++)
				{
					if ($i<count($cols)-1)					
						$strVals = $strVals .  "'" . $vals[$i] ."' , ";					
					else 	
						$strVals = $strVals . "'" .$vals[$i] . "' " ;
				}
		 		$query = "INSERT INTO " . $table ." VALUES (" . $strVals . " ) " ; 
			}
			return $this->doQuery($query) ;
		}
		
		//Use this when you want to select rows from tables
		//Takes correct Tables as a Array of string , condition as string
		//if you don't want to have any condition , set condition value with ""
		//Returns a 2 dimensional array with the result.
		function doSelect ($tabelsArr , $condition = "") 
		{
			if ( $condition != "" )
			{	
		   		foreach ($tabelsArr as $value)
				{
		             $query = "SELECT * FROM " . $value . " WHERE " . $condition ;
					 $this->_result = mysql_query($query,$this->_connection) or die($sql."\n".mysql_error());
		             $item = array();
		
		             while($item = mysql_fetch_array ($this->_result))
		             {
		                 $this->_items[] = $item ;            
		                 $selecteditems++ ;
		             }
				}
			}
			else 
			{
				foreach ($tabelsArr as $value)
				{
		             $query = "SELECT * FROM " . $value ;
					 $this->_result = mysql_query($query,$this->_connection) or die($sql."\n".mysql_error());
		             $item = array();
		
		             while($item = mysql_fetch_array ($this->_result))
		             {
		                 $this->_items[] = $item ;            
		                 $selecteditems++ ;
		             }
				}
			}
			return $this->_items ;
		   }
		   
		//Use this when you want to select rows from a table
		//Takes correct Table as a string , condition as string
		//if you don't want to have any condition , set condition value with ""
		//Returns a 2 dimensional array with the result.
	   function doSelect2 ($table , $condition)
	   {
			if ($condition!="")
			{
				$query = 'SELECT * FROM ' . $table . ' WHERE ' . $condition ;
			}
			else 
			{
			  $query = 'SELECT * FROM ' . $table  ;

			}	

			return $this->doQueryResult($query) ;
	   } 


		//Closes connection to the database.
		function closeCon()
		{
			mysql_close($this->_connection);
			return true;
		}
	}
	/////////////////////////////////////////////
	
	$db = new cDbInterface('fees0_2410384_book');
?>
