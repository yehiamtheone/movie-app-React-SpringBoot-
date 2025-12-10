package dev.yk.movies.dtos;

import org.bson.types.ObjectId;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final ObjectId id;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(ObjectId id, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.password = password;
        this.authorities = authorities;

    }



    // This method returns the ObjectId as a String, as required by Spring Security


    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return id.toHexString();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    // Required methods from UserDetails interface
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}