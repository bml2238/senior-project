package com.senior.project.backend.converters;

import java.nio.ByteBuffer;
import java.util.UUID;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

/**
 * Converts a UUID into a byte buffer
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class UUIDToBytes implements Converter<UUID, ByteBuffer> {
    @Override
    public ByteBuffer convert(UUID source) {
        ByteBuffer buffer = ByteBuffer.wrap(new byte[16]);
        buffer.putLong(source.getMostSignificantBits());
        buffer.putLong(source.getLeastSignificantBits());
        return buffer;
    }
}
