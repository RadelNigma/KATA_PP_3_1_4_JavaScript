package ru.kata.spring.boot_security.demo.restcontroller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.exeption_handling.NoSuchUserException;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.finedAll();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable long id) {
         User user = userService.findById(id);
         if (user==null){
             throw new NoSuchUserException("There is no user with ID = "
                     + id + " in Database!");
         }
        return user;
    }

    @PostMapping("/")
    public User addNewUser(@RequestBody User user){
        userService.saveUser(user);
        return user;
    }
    @PatchMapping("/")
    public User updateUser (@RequestBody User user){
        userService.saveUser(user);
        return user;
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable long id) {
        User user = userService.findById(id);
        if (user==null){
            throw new NoSuchUserException("There is no user with ID = "
                    + id + " in Database!");
        }
        userService.deleteById(id);
        return "User with ID = " + id + " was deleted!";
    }

    @GetMapping("/principal")
    public User viewAdminPage(Principal principal){
        return userService.findUserByEmail(principal.getName());
    }
}
