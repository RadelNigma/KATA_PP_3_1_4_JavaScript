package ru.kata.spring.boot_security.demo.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.exeption_handing.NoSuchUserException;
import ru.kata.spring.boot_security.demo.exeption_handing.UserIncorrectData;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class MyRestController {

    private final UserService userService;

    public MyRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.finedAll();
    }

    @GetMapping("/user/{id}")
    public User getUser(@PathVariable long id) {
         User user = userService.findById(id);
         if (user==null){
             throw new NoSuchUserException("There is no user with ID = "
                     + id + " in Database!");
         }
        return user;
    }

    @PostMapping("/user")
    public User addNewUser(@RequestBody User user){
        userService.saveUser(user);
        return user;
    }
    @PutMapping("/user")
    public User updateUser (@RequestBody User user){
        userService.saveUser(user);
        return user;
    }

    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable long id) {
        User user = userService.findById(id);
        if (user==null){
            throw new NoSuchUserException("There is no user with ID = "
                    + id + " in Database!");
        }
        userService.deleteById(id);
        return "User with ID = " + id + " was deleted!";
    }
}
