pragma solidity ^0.4.17;

contract DateApp {
    
    address manager;
    
    struct Profile {
        mapping(address=>bool) likes;
        
        mapping(address=>bool) matches;
        address[] matches_array;
        
        // payments
        mapping(address => uint) payment;
        address place;

        // personal address 
        address addr;
        uint age;
        string bio;
    }
    
    mapping (address => string) public numbers;
    mapping(address => bool) public place_mappings; 
    mapping(address => string) public place_to_string; 
    address[] public places;
    
    address[] public profiles;
    mapping(address=>Profile) public profile_map;
    
    function DateApp() public {
        manager = msg.sender;

       
    }
    
    function addPlace(address addr, string place) {
        require(msg.sender==manager);
        
        place_mappings[addr] = true; // add a string here too
        place_to_string[addr] = place;
        places.push(addr);
    }
    
    function createProfile(
        uint age,
        string number,
        address place,
        string bio
        ) public {
        require(place_mappings[place]);   
 
        
        address[] memory mtches;
        delete mtches;
        Profile memory newProfile = Profile ({
            addr: msg.sender,
            age: age,
            matches_array: mtches,
            place: place,
            bio: bio
        });
        
        numbers[msg.sender] = number;
        profile_map[msg.sender] = newProfile;
        profiles.push(msg.sender);
        
    }
    
    // pay the contract
    // change the signautre to accept a merchant addr
    function payDate(address her) public payable {
        require(msg.value > 0.01 ether);
        require(isMatch(her, msg.sender));
        
        Profile storage her_profile = profile_map[her];
        address merchant = her_profile.place;
        
        her_profile.payment[msg.sender] = msg.value;
        
        // now, if she ALSO paid, then just go on
        Profile storage me = profile_map[msg.sender];
        if (me.payment[her] > 0) {
            // so now they both paid the contract
            uint amount = me.payment[her] + her_profile.payment[msg.sender];
            merchant.transfer(amount); 
        }
    }
    
   
    
    // add a merchant address
    function setPlace(address addr) public {
        require(place_mappings[addr]);
    
        
        Profile storage me = profile_map[msg.sender];
        me.place = addr;
    }
    
    function clearProfiles() public {
        require(msg.sender == manager);
        delete profiles;

        
        manager.transfer(this.balance);
        
 
    

    }
    
    function withdraw(address addr) public {
        Profile storage her = profile_map[addr];
        uint amount = her.payment[msg.sender];
        require(amount > 0);
        
        // and make sure to reset this ammount
        
        msg.sender.transfer(amount);
        
    }
    
    function likeProfile(address addr) public {
        Profile storage her = profile_map[addr];
        Profile storage me = profile_map[msg.sender];
        
        require(!her.likes[msg.sender]);
        
        her.likes[msg.sender] = true;
        
       
        // now check for him as well
        if (me.likes[addr]==true) {
            me.matches[addr] = true;
            her.matches[msg.sender] = true;
        
            her.matches_array.push(msg.sender);
            me.matches_array.push(addr);
        }
    
    }
    
    function getNumber(address her, address me) public view returns(string) {
        require(isMatch(her, me));
        return numbers[her];
    }
    
    
    function getMatches(address addr) public view returns(address[]) {
        return profile_map[addr].matches_array;
    }
    
    function getPlaces() public view returns(address[]) {
        return places;    
    }
    
    function getAge(address addr) public view returns(uint) {
        Profile storage me = profile_map[addr];
        return me.age;
        
        
    }
    
    function getPlace(address addr) public view returns(address) {
        Profile storage her = profile_map[addr];
        address merch = her.place;
        return merch;
    }
    
    function verifyAddress(address merchant) public view returns(bool){
        require(place_mappings[merchant]);
        return true;
    }
    
    function getProfiles() public view returns(address[]) {
        return profiles;
    }
    
    function getBio(address addr) public view returns(string) {
        Profile me = profile_map[addr];
        return me.bio;
    }
    
    // did I pay her?
    function didPay(address her, address me) public view returns(bool) {
        Profile her_profile = profile_map[her];
        if (her_profile.payment[me] > 0) {
            return true;
        }
        return false;
        
    }
    
    // did I like her?
    function didLike(address her, address me) public view returns(bool) {
        Profile her_profile = profile_map[her];
        if (her_profile.likes[me]) {
            return true;
        }
        return false;
        
    }
    
    
  

    function isMatch(address her, address me) view returns(bool){
        Profile storage her_profile = profile_map[her];
        Profile storage my_profile = profile_map[me];
        if (her_profile.matches[me] && my_profile.matches[her]) {
            return true;
        }
        return false;
    }
 
}