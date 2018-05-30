var mainApp = angular.module("mainApp", ['ngRoute']);
mainApp.config(function($routeProvider) {

$routeProvider
.when('/signup', {
url:'/signup',
templateUrl: 'signup.html',
controller: 'adminCtrl'
})
.when('/login', {
url:'/login',
templateUrl: 'login.html',
controller: 'loginCtrl'
})

.when('/dash', {
url:'/dash',
templateUrl: 'get.html',
controller: 'dashCtrl'
})

.when('/getprofile', {
url:'/getprofile',
templateUrl: 'getprofile.html',
controller: 'getprofileCtrl'
})



.when('/assigntask', {
url:'/assigntask',
templateUrl: 'assigntask.html',
controller: 'adminCtrl'
})

.when('/search', {
url:'/search',
templateUrl: 'search.html',
controller: 'searchCtrl'
})

.when('/emp', {
url:'/emp',
templateUrl:'employeepage.html',
controller:'empCtrl'
})
.otherwise({
redirectTo: '/login'
})
});

mainApp.run(function($rootScope,$location){
	$rootScope.location=$location;
});

mainApp.controller('myctrl',function($scope,$http,$window,$location){
	
	$scope.searchpage=function(){$location.path('/search')}
	$scope.profilepage=function(){$location.path('/getprofile')}
	$scope.dashpage=function(){$location.path('/dash')}
	$scope.statuspage=function(){$location.path('/emp')}
	$scope.logout=function(){$window.localStorage.clear();$location.path('login');}
	$scope.assignpage=function(){$location.path('/assigntask');}
	
})

mainApp.controller('loginCtrl',function($scope,$http,$window,$location)
{
$scope.login=function(){

var response={
"uname":$scope.uname,
"pwd":$scope.pwd
}
alert(JSON.stringify(response))
$http.post('http://localhost:7000/login',response).then(function(response)
	  {
		$window.alert(JSON.stringify(response))
		
		  if(response.data.output.length!=0)
          {
			  
			  console.log(JSON.stringify(response.data.output[0]))
			  $window.localStorage.setItem('profile',JSON.stringify(response.data.output[0]))
			 
			  
			  if(response.data.output[0].designation=="Lead")
			  {
				  
			 alert('valid lead credentials');
			 $location.path('/getprofile');
             console.log(JSON.stringify(response.data.output[0]))
             $window.localStorage.setItem('profile',JSON.stringify(response.data.output[0]))
			  }
		    		                 
                   else{
					    $window.localStorage.setItem('profile1',JSON.stringify(response.data.output[0]))
					   alert("miracle  employe");
					   $location.path('/getprofile')
					   
                       }
                       					   
	  }
		  else{
			  alert("Login Failed")
			}
	  })
  }
  
});



//getprofile

mainApp.controller('getprofileCtrl',function($scope,$http,$window,$location)
{
	
	var bdata2=JSON.parse($window.localStorage.getItem('profile1'))
	console.log(bdata2.email)
	var email=bdata2.email
	var data={
			"mailid":email
			}
			console.log(JSON.stringify(data))
			$http.post("http://localhost:7000/getprofile",data).then(function(response)
			{
				if(response.data.error==undefined){
				console.log(JSON.stringify(response.data.output))
				$scope.res1=response.data.output
				
			}
				else{
					$window.alert('Failed to receive Task');
					}
			})

	
});





//dashboard ctrl

mainApp.controller('dashCtrl', function($scope, $http, $window,$rootScope) {	
    $scope.dash = function() {
		var route=$scope.route;
        var route1 = $scope.route1;
		//alert(route1)	
        $http.get("http://localhost:7000/retrieveById?Project="+route1).then(function(response) {
            if (response.status == 200)
				{			
				//alert(JSON.stringify(response.data.output))			
				$rootScope.res1=response.data.output;			
				}
			else
				{
                $window.alert('Please Check Correctly');
				}	
        });
		}
			$scope.clearData = function() {
									document.getElementById("showData").style.display = "none";
								  }
});




//emp search 


mainApp.controller('searchCtrl',function($scope,$http,$window)
{

$scope.search=function(data)
{
var name=data.name;
//alert(name);
$http.get('http://localhost:7000/employeesearch?name='+name).then(function(response)
{
if(response.error==undefined)
{
//alert(JSON.stringify(response.data.output))
$scope.res2=response.data.output

}
else
{
alert("Invalid Response")
}
})
}
})









mainApp.controller('adminCtrl', function($scope,$http,$window,$location)
{
	var bdata=JSON.parse($window.localStorage.getItem('profile'))
	console.log("in admin page"+bdata.email)
	var email=bdata.email
	var db={"email":email} 
	$http.post('http://localhost:7000/reportsTo',db).then(function(res)
	{
		if(res.data.output.length!=0)
		{
			$scope.a=res.data.output;
		
			console.log(res.data.output)
		}
			else
			{
	
	     alert("failed");
			}
		})
		$scope.getTask=function(){
			var data={
				"qsn":$scope.qsn,
				"mail":$scope.n,
				"leadid":email
			}
			//alert(JSON.stringify(data))
			$http.post("http://localhost:7000/AssignTask",data).then(function(response)
			{
				if(response.data.error==undefined){
					$window.alert('Task has been Assigned successfully');
				}
				else{
					$window.alert('Failed to Assign Task');
				}
			})
		}
	
	 $scope.register=function(){
$window.location.href = '/signup.html';
$location.path('/signup');
}



$scope.adminlogout=function(){
	//var bdata=JSON.parse($window.localStorage.getItem('profile1'))
	$window.localStorage.clear();
	$location.path('login');
	
}



	$scope.getStatus=function(){
		
		var rdata={
			"rmail":email
		}
		$http.post("http://localhost:7000/gets",rdata).then(function(response)
		{
			if(response.data.error==undefined){
					$window.alert(JSON.stringify(response.output));
					$scope.r=response.data.output;
				}
				else{
					$window.alert('Failed to Assign Task');
				} 
				
		})
		
	}
	
	
	
	
	

	});
	
	//get task
	mainApp.controller('empCtrl',function($scope,$http,$window,$location)
	{
	

	
	var bdata=JSON.parse($window.localStorage.getItem('profile1'))
	console.log(bdata.email)
	var email=bdata.email
	var data={
			"mailid":email
			}
			console.log(JSON.stringify(data))
			$http.post("http://localhost:7000/gettask",data).then(function(response)
			{
				if(response.data.error==undefined){
				console.log(JSON.stringify(response.data.output))
				$scope.mani=response.data.output
				
			}
				else{
					$window.alert('Failed to receive Task');
					}
			})




$scope.logout=function(){
	//var bdata=JSON.parse($window.localStorage.getItem('profile1'))
	$window.localStorage.clear();
	$location.path('login');
	
}





$scope.update=function(teja){
	
	var comments=teja.comments;
	var status=teja.status;
	var to=teja.assignedto;
	var by=teja.assignedby;
	var details=teja.taskdetails;
	
	console.log(comments+""+status+""+to+""+by+""+details)
	
	var data=
	{
		"to":to,
		"by":by,
		"details":details,
		"comments":comments,
		"status":status
	}
	
	$http.post('http://localhost:7000/updatetasks',data).then(function(response){
		if(response.data.error==undefined)
		{
			alert("updated")
		}
		else{alert("Failed to Update")}
			
	})
	
}
})
	