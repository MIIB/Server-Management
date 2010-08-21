<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
<link type="text/css" href="css/serversstate.css" rel="stylesheet" />
    <script type="text/javascript">
        $(document).ready(function(){
            $("#report tr:odd").addClass("odd");
            $("#report tr:even").addClass('test');
            $("#report tr:first-child").show();
            
            $("#report tr:odd").click(function(){
                $(this).next("tr").toggleClass( 'test' );
                $(this).find(".arrow").toggleClass("up");
            });
//            $("#report").jExpand();
        });
    </script>        
	<?php
		$cols=3;
		require_once("../../db.php");
		$db=new CDbInterface("mydb");
		$res=$db->doQueryResult("select * from servers");
	?>	

<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
</head>

<body>
    <table id="report">
    <tr>
        <th>Id</th>
        <th>ServerName</th>
        <th>Temperature</th>
        <th></th>
    </tr>
    <?php
		$allcols=$cols+1;
    	foreach($res as $t){
    		echo "<tr>";
    		foreach($t as $key => $tt)
    			if($key!="Details")
    				echo "<td>$tt</td>";
    				echo "<td style='width:40px'><div class='arrow'></div></td>";
    		echo "</tr>";
    		if($t['Details'])
	    		echo "<tr class='test'><td colspan='$allcols'>".$t['Details']."</td></tr>";
	    	else 
	    		echo "<tr></tr>";
    	}
    ?>
	</table>



</body>

</html>
